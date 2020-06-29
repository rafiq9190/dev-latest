import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/Layout"
import Profile from "../components/Profile"
import Activation from "../components/Activation"
import ProjectCreate from "../components/Projects/create"
import Projects from "../components/Projects"
import Login from "../components/Login"
import PrivateRoute from "../components/PrivateRoute"
import ProjectPublicView from "../components/Projects/publicview"

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/app/projects" component={Projects} />
      <PrivateRoute path="/app/project/create" component={ProjectCreate} />
      <PrivateRoute path="/app/profile" component={Profile} />
      <PrivateRoute path="/app/activate" component={Activation} />
      <Login path="/app/login" />
      <ProjectPublicView path="/app/:userid/project/:slug" />
    </Router>
  </Layout>
)

export default App
