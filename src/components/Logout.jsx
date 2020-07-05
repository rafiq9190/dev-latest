import React from "react"
import { navigate } from '@reach/router';
import { isLoggedIn, logout } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"

const Logout = () => {
  if (!window.confirm("Are you sure you want to Logout from the Dashboard?")) {
    navigate(`/dashboard/`, { replace: true });    
    return null
  } 
  if (isLoggedIn()) {
    logout(firebase).then(() => navigate(`/dashboard/login`, { replace: true }));    
    return null
  }

}

export default Logout
