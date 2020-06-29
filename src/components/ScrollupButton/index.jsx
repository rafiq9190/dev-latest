import React from "react"
import ScrollToTop from "react-scroll-up"
import { FiArrowUpCircle } from "react-icons/fi"

const ScrollupButton = () => {

  return (
    <div>
      <ScrollToTop
        showUnder={300}
        duration={700}
        easing="easeInOutCubic"
        style={{ bottom: 30, right: 20 }}
      >
        <FiArrowUpCircle className="btn-primary" style={{
          width: `40px`,
          height: `40px`,
          borderRadius: `50%`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.25)`,
          transition: `0.15s ease-in-out`,
        }} />
      </ScrollToTop>
    </div>
  )
}

export default ScrollupButton
