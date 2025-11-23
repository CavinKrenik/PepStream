require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const app = express();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items, customerEmail, metadata } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const line_items = items.map(i => ({
      price_data: {
        currency: 'usd',
        product_data: { name: i.title },
        unit_amount: Math.round((i.price || 0) * 100),
      },
      quantity: i.qty || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      customer_email: customerEmail || undefined,
      metadata: metadata || {},
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/store`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('create-checkout-session error', err);
    res.status(500).json({ error: err.message });
  }
});

// minimal webhook handler example (optional)
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Checkout completed for session:', session.id);
    // TODO: fulfill the order using session.metadata or session.customer_email
  }

  res.json({ received: true });
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Stripe server listening on port ${port}`));
