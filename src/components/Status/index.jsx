import React from "react"
import { Link, navigate } from "@reach/router"
import { getUser, isLoggedIn, logout } from "../../utils/auth"
import firebase from "gatsby-plugin-firebase"

export default () => {
  
  let details;
  if (!isLoggedIn()) {
    details = (
      <div className="text-right px-5">
        <Link to="/dashboard/login"><u>Log in</u></Link>
      </div>
    )
  } else {
    const { displayName, email } = getUser()
    details = (
      <div className="text-right px-5">
        Logged in as {displayName} ({email}
        )!
        {` `}
        <a href="/" onClick={event => { event.preventDefault(); logout(firebase).then(() => navigate(`/dashboard/login`)) }}>
          <u>log out</u>
        </a>
      </div> 
    )
  }

  return <div>{details}</div>
}
