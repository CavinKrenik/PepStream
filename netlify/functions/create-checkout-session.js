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
    const { items, shipping } = payload;

    // Validate items
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
            name: item.title || 'Peptide',
          },
          unit_amount: priceInCents,
        },
        quantity,
      };
    });

    // Add shipping as its own line item (shipping is a number from your React code)
    const shippingAmountCents = Math.round(Number(shipping || 0) * 100);
    if (shippingAmountCents > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: shippingAmountCents,
        },
        quantity: 1,
      });
    }

    // Figure out your site origin (e.g. https://peptidestream.com)
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
      line_items,
      // You can add customer_email or metadata here later if you want
      success_url: `${origin}/store?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store?status=cancel`,
    });

    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    console.error('create-checkout-session function error', err);
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: err.message || 'Internal server error' }),
    };
  }
};
