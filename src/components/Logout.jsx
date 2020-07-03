import React from "react"
import { navigate } from '@reach/router';
import View from "./View"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { isLoggedIn, logout } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"

const Logout = () => {

  if (isLoggedIn()) {
    logout(firebase).then(() => navigate(`/dashboard/login`, { replace: true }));    
    return null
  }

}

export default Logout
