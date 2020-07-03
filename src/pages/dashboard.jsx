import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/Layout"
import Profile from "../components/Profile"
import Activation from "../components/Activation"
import PageCreate from "../components/Pages/create"
import Pages from "../components/Pages"
import Login from "../components/Login"
import Logout from "../components/Logout"
import PrivateRoute from "../components/PrivateRoute"
import { isBrowser } from "../utils/auth"

const Dashboard = ({location}) => {

  return (
    <Layout location={location}>
      {isBrowser() &&
        <Router>
          <PrivateRoute path="/dashboard/" component={Pages} />
          <PrivateRoute path="/dashboard/pages" component={Pages} />
          <PrivateRoute path="/dashboard/page/create" component={PageCreate} />
          <PrivateRoute path="/dashboard/profile" component={Profile} />
          <PrivateRoute path="/dashboard/activate" component={Activation} />
          <PrivateRoute path="/dashboard/logout" component={Logout} />
          <Login path="/dashboard/login" />
        </Router>
      }

    </Layout>
  )
}
export default Dashboard