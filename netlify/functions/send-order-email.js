const sgMail = require('@sendgrid/mail')

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' }
    }

    const apiKey = process.env.SENDGRID_API_KEY
    if (!apiKey) {
      console.error('Missing SENDGRID_API_KEY')
      return { statusCode: 500, body: 'Email not configured' }
    }

    sgMail.setApiKey(apiKey)

    const toEmail = process.env.ORDER_TO_EMAIL || 'peptidestream@gmail.com'
    const fromEmail = process.env.ORDER_FROM_EMAIL || toEmail

    console.log('--- SendGrid Debug ---')
    console.log('API Key present:', !!apiKey)
    console.log('To:', toEmail)
    console.log('From:', fromEmail)
    console.log('----------------------')
    const data = JSON.parse(event.body || '{}')
    const {
      customer = {},
      items = [],
      totals = {},
      researchUseConfirmed,
      orderText,
    } = data

    if (!items.length) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No items in order' }),
      }
    }

    const subject = 'New PeptideStream Order (Research-Use-Only)'

    const textBody =
      orderText ||
      [
        'New PeptideStream order received.',
        '',
        'Customer:',
        `Name: ${customer.name || ''}`,
        `Phone: ${customer.phone || ''}`,
        `Email: ${customer.email || ''}`,
        `Address: ${customer.address || ''}`,
        '',
        'Research use confirmed: ' + (researchUseConfirmed ? 'Yes' : 'No'),
        '',
        'Items:',
        ...items.map(
          (i) =>
            `- ${i.title} x ${i.qty} @ $${Number(i.price).toFixed(2)}`
        ),
        '',
        `Subtotal: $${Number(totals.subtotal || 0).toFixed(2)}`,
        `Shipping: $${Number(totals.shipping || 0).toFixed(2)}`,
        `Total:    $${Number(totals.grand || 0).toFixed(2)}`,
      ].join('\n')

    const msg = {
      to: toEmail,
      from: fromEmail,
      subject,
      text: textBody,
    }

    await sgMail.send(msg)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    }
  } catch (err) {
    console.error('Email send error:', err)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    }
  }
}
