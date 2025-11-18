import React from 'react'

export default function Contact() {
  const handleSubmit = e => {
    e.preventDefault()
    const form = e.currentTarget
    const name = form.name.value.trim()
    const email = form.email.value.trim()
    const org = form.org.value.trim()
    const message = form.message.value.trim()

    if (!name || !email || !message) {
      alert('Please complete the required fields.')
      return
    }

    const lines = []
    lines.push('PeptideStream Contact Request')
    lines.push('----------------------------')
    lines.push(`Name: ${name}`)
    lines.push(`Email: ${email}`)
    if (org) lines.push(`Organization: ${org}`)
    lines.push('')
    lines.push('Message:')
    lines.push(message)

    const recipient = 'peptidestream@gmail.com'
    const subject = encodeURIComponent('PeptideStream Contact')
    const body = encodeURIComponent(lines.join('\n'))
    const href = `mailto:${encodeURIComponent(
      recipient
    )}?subject=${subject}&body=${body}`

    const a = document.createElement('a')
    a.href = href
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
  }

  return (
    <main className="container">
      <h1 className="title">Contact PeptideStream</h1>
      <div className="card" style={{ marginTop: 12 }}>
        <p className="info">
          For support, order verification, documentation requests, or
          account questions, please use the form below.
          PeptideStream does not provide medical advice or guidance
          on human use. All products are for laboratory research-use only.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <label htmlFor="name">Name*</label>
            <input id="name" name="name" required />
          </div>
          <div className="field-row">
            <label htmlFor="email">Email*</label>
            <input
              id="email"
              name="email"
              type="email"
              required
            />
          </div>
          <div className="field-row">
            <label htmlFor="org">Organization (optional)</label>
            <input id="org" name="org" />
          </div>
          <div className="field-row">
            <label htmlFor="message">Message*</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              required
            />
          </div>
          <button type="submit" className="btn pay">
            Send via Email
          </button>
        </form>
      </div>
    </main>
  )
}
