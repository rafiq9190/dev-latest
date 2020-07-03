import React from "react"
import { navigate } from "gatsby"
import { isLoggedIn, isBrowser } from "../utils/auth"

const Index = ({location}) => {
  if (isBrowser() && !isLoggedIn() && location.pathname !== `/dashboard/login`) {
    // If we’re not logged in, redirect to the login page.
    navigate(`/dashboard/login`, { replace: true })
    return null
  }
  if(isBrowser() && isLoggedIn()) {
    // If we’re logged in, redirect to the dashboard page.
    navigate(`/dashboard/`, { replace: true })
    return null;
  }
  return (
    <>
    </>
  );
}
export default Index
