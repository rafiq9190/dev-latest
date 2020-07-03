import React from "react"
import { navigate } from "gatsby"
import { isLoggedIn } from "../utils/auth"

const Index = ({location}) => {
  if (!isLoggedIn() && location.pathname !== `/dashboard/login`) {
    // If we’re not logged in, redirect to the login page.
    navigate(`/dashboard/login`, { replace: true })
    return null
  }
  if(isLoggedIn()) {
    // If we’re logged in, redirect to the dashboard page.
    navigate(`/dashboard/`, { replace: true })
    return null;
  }
}
export default Index
