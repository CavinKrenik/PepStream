// netlify/functions/send-order-email.js
const sgMail = require('@sendgrid/mail')

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: defaultHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  if (!process.env.SENDGRID_API_KEY) {
    console.error('Missing SENDGRID_API_KEY')
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: 'Email not configured' }),
    }
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  try {
    const payload = JSON.parse(event.body || '{}')

    const {
      customer = {},
      items = [],
      totals = {},
      researchUseConfirmed,
      orderText, // optional preformatted text
    } = payload

    const toEmail =
      process.env.ORDER_TO_EMAIL || 'peptidestream@gmail.com'
    const fromEmail =
      process.env.ORDER_FROM_EMAIL || toEmail

    if (!items.length) {
      return {
        statusCode: 400,
        headers: defaultHeaders,
        body: JSON.stringify({ error: 'No items in order' }),
      }
    }

    const {
      name = '',
      email = '',
      phone = '',
      address = '',
    } = customer

    const { subtotal = 0, shipping = 0, grand = 0 } = totals

    // Build plain-text summary if not provided
    const lines = []
    if (orderText) {
      lines.push(orderText)
    } else {
      lines.push('PeptideStream Order')
      lines.push('-------------------')
      lines.push(`Name: ${name}`)
      lines.push(`Phone: ${phone}`)
      lines.push(`Email: ${email}`)
      lines.push('Address:')
      lines.push(address)
      lines.push('')
      lines.push('Items:')
      items.forEach(i => {
        lines.push(
          `- ${i.title} x ${i.qty} @ $${Number(i.price).toFixed(
            2
          )} = $${(Number(i.price) * i.qty).toFixed(2)}`
        )
      })
      lines.push('')
      lines.push(`Subtotal: $${Number(subtotal).toFixed(2)}`)
      lines.push(`Shipping: $${Number(shipping).toFixed(2)}`)
      lines.push(`Total:    $${Number(grand).toFixed(2)}`)
      lines.push('')
      lines.push(
        `Research-use-only confirmed: ${researchUseConfirmed ? 'Yes' : 'No'}`
      )
      lines.push(
        'All materials for lawful laboratory research use only. Not for human or veterinary use.'
      )
    }

    const textBody = lines.join('\n')

    const msg = {
      to: toEmail,
      from: fromEmail,
      subject: 'New PeptideStream Order (Research-Use-Only)',
      text: textBody,
    }

    await sgMail.send(msg)

    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({ ok: true }),
    }
  } catch (err) {
    console.error('send-order-email error', err)
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({
        error: err.message || 'Failed to send order email',
      }),
    }
  }
}
