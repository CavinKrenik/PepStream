import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} PeptideStream. All products are for
        laboratory research use only. Not for human consumption.
      </p>
      <nav className="footer-nav" aria-label="Footer navigation">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/terms">Terms &amp; Conditions</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>
          <li><Link to="/refund">Refund Policy</Link></li>
          <li><Link to="/disclaimer">Research Use Only</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </footer>
  )
}
