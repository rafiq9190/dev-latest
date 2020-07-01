import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/Layout"
import Profile from "../components/Profile"
import Activation from "../components/Activation"
import ProjectCreate from "../components/Projects/create"
import Projects from "../components/Projects"
import Login from "../components/Login"
import PrivateRoute from "../components/PrivateRoute"

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/dashboard/" component={Projects} />
      <PrivateRoute path="/dashboard/pages" component={Projects} />
      <PrivateRoute path="/dashboard/page/create" component={ProjectCreate} />
      <PrivateRoute path="/dashboard/profile" component={Profile} />
      <PrivateRoute path="/dashboard/activate" component={Activation} />
      <Login path="/dashboard/login" />
    </Router>
  </Layout>
)

export default App
