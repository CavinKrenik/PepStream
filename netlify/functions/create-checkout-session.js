const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { items, shipping, customerEmail, customerName, phone, address, subtotal, total } = payload;

    // Build Stripe line items from cart
    const line_items = [];

    (items || [])
      .filter(i => i.qty > 0)
      .forEach(i => {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: i.title,
            },
            // Stripe uses cents
            unit_amount: Math.round(i.price * 100),
          },
          quantity: i.qty,
        });
      });

    // Add shipping as its own line item if needed
    if (shipping && shipping > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    if (!line_items.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No items provided' }),
      };
    }

    const origin = event.headers.origin || `https://${event.headers.host}`;

    // Attach helpful metadata so you can fulfill the order from the webhook
    const metadata = {
      source: 'netlify-function',
      customerName: customerName || '',
      phone: phone || '',
      address: address || '',
    };
    if (typeof subtotal !== 'undefined') metadata.subtotal = String(subtotal);
    if (typeof total !== 'undefined') metadata.total = String(total);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: customerEmail || undefined,
      metadata,
      success_url: `${origin}/store?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store?status=cancel`,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    console.error('create-checkout-session function error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
