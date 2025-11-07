import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AgeGate() {
  const navigate = useNavigate()

  useEffect(() => {
    const verified = window.localStorage.getItem('ps_verified')
    if (verified === 'true') {
      navigate('/store', { replace: true })
    }
  }, [navigate])

  const handleEnter = () => {
    window.localStorage.setItem('ps_verified', 'true')
    navigate('/store', { replace: true })
  }

  const handleDecline = () => {
    window.localStorage.removeItem('ps_verified')
    alert(
      'Access is restricted to qualified individuals purchasing for lawful laboratory research use only.'
    )
  }

  return (
    <main className="container" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="card" style={{ width: '100%' }}>
        <h1 className="title">PeptideStream – Laboratory Research Use Only</h1>
        <p className="tagline">
          Our products are intended solely for lawful laboratory research
          conducted by qualified professionals.
        </p>
        <p className="info">
          By entering, you confirm that you are at least 21 years of age, that
          you understand these materials are not for human consumption, medical,
          veterinary, or household use, and that you agree to our Terms &amp;
          Conditions of Sale.
        </p>
        <div className="actions" style={{ marginTop: 18 }}>
          <button type="button" className="btn pay" onClick={handleEnter}>
            I Confirm &amp; Enter
          </button>
          <button
            type="button"
            className="btn"
            style={{
              background: 'transparent',
              border: '1px solid var(--line)',
              color: 'var(--muted)',
            }}
            onClick={handleDecline}
          >
            I Do Not Agree
          </button>
        </div>
      </div>
    </main>
  )
}
