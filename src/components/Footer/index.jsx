import React from "react"
import './footer.css'
const Footer = () => {

  return (
    <footer className="d-flex card-footer text-muted">
      <div className="w-100">
        © {new Date().getFullYear()} Copyright, Hyperlyst.com
        </div>
      <div className="w-100 text-right">Powered by{` `}
        <a href="https://www.hyperlyst.com">Hyperlyst</a>
      </div>
    </footer>
  )
}

export default Footer
