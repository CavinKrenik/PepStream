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

    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers: defaultHeaders,
        body: JSON.stringify({ error: 'No items provided' }),
      };
    }

    // Build line items
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
            name: item.title || 'Research peptide',
          },
          unit_amount: priceInCents,
        },
        quantity,
      };
    });

    // Shipping as separate line item
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

    const orderSummary = items
      .map((i) => `${i.title || 'Item'} x${i.qty || 1}`)
      .join('; ')
      .slice(0, 450);

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
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      customer_email: customerEmail || undefined,
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

    // ⬅️ NEW: return the URL instead of just the ID
    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        url: session.url,
        id: session.id, // optional, but can be handy later
      }),
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
