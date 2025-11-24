// netlify/functions/stripe-webhook.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Stripe-Signature',
}

exports.handler = async (event) => {
  // Stripe must send POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: defaultHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const sig = event.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable')
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: 'Webhook secret not configured' }),
    }
  }

  let stripeEvent

  try {
    // Important: use the raw body for signature verification
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    )
  } catch (err) {
    console.error('❌ Stripe webhook signature verification failed:', err.message)
    return {
      statusCode: 400,
      headers: defaultHeaders,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    }
  }

  // Handle only successful checkout completions (you can add more types later)
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object

    // This metadata comes from payment_intent_data.metadata in create-checkout-session
    const metadata = session.metadata || session.payment_intent?.metadata

    console.log('✅ Checkout completed:')
    console.log('  Session ID:', session.id)
    console.log('  Customer email:', session.customer_details?.email)
    console.log('  Amount total:', session.amount_total)
    console.log('  Metadata:', metadata)

    // 👉 NEXT STEP (optional, future): send an email to peptidestream@gmail.com
    // using a mail provider (SendGrid, Mailgun, etc.) with:
    // - customer name / email / phone
    // - order_summary
    // - research_use_only flag
  } else {
    console.log(`ℹ️ Received Stripe event type: ${stripeEvent.type}`)
  }

  return {
    statusCode: 200,
    headers: defaultHeaders,
    body: JSON.stringify({ received: true }),
  }
}
