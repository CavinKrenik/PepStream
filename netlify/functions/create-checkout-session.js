// netlify/functions/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: defaultHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { items, shipping, customer, researchUseConfirmed } = payload;

    // Basic validation
    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers: defaultHeaders,
        body: JSON.stringify({ error: 'No items provided' }),
      };
    }

    // Build Stripe line items from cart
    const line_items = items.map((item) => {
      const priceInCents = Math.round(Number(item.price) * 100);
      if (!Number.isFinite(priceInCents) || priceInCents <= 0) {
        throw new Error(`Invalid price for item: ${item.title || item.id || 'Unknown'}`);
      }
      const quantity = item.qty && item.qty > 0 ? item.qty : 1;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            // Keep product names factual, no dosing/instructions
            name: item.title || 'Research peptide',
          },
          unit_amount: priceInCents,
        },
        quantity,
      };
    });

    // Add shipping as a separate line item if needed
    const shippingAmountCents = Math.round(Number(shipping || 0) * 100);
    if (shippingAmountCents > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping (research materials)' },
          unit_amount: shippingAmountCents,
        },
        quantity: 1,
      });
    }

    const customerName = customer?.name || '';
    const customerEmail = customer?.email || '';
    const customerPhone = customer?.phone || '';
    const customerAddress = customer?.address || '';

    // Compact order breakdown string for metadata
    const orderSummary = items
      .map((i) => `${i.title || 'Item'} x${i.qty || 1}`)
      .join('; ')
      .slice(0, 450); // stay under Stripe's 500-char metadata limit

    // Build a safe origin for success/cancel URLs
    const origin =
      process.env.FRONTEND_URL ||
      event.headers.origin ||
      (event.headers['x-forwarded-host']
        ? `https://${event.headers['x-forwarded-host']}`
        : event.headers.host
        ? `https://${event.headers.host}`
        : 'http://localhost:5173');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,

      // Restrict shipping to US (typical for peptide research vendors)
      shipping_address_collection: {
        allowed_countries: ['US'],
      },

      // Let Stripe send receipts to the same email
      customer_email: customerEmail || undefined,

      // Put the important stuff on the underlying PaymentIntent
      payment_intent_data: {
        metadata: {
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          order_summary: orderSummary,
          research_use_only: researchUseConfirmed ? 'true' : 'false',
          compliance_note:
            'All items sold for lawful laboratory research use only. Not for human or veterinary use. No medical, diagnostic, or therapeutic claims are made.',
        },
      },

      success_url: `${origin}/store?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store?status=cancel`,
    });

    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    console.error('create-checkout-session error', err);
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: err.message || 'Internal server error' }),
    };
  }
};
