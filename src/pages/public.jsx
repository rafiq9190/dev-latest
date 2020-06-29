import React from "react"
import { Router } from "@reach/router"
import ProjectPublicView from "../components/Projects/publicview"

const Public = () => (
    <Router>
      <ProjectPublicView path="/public/:userid/project/:slug" />
    </Router>
)

export default Public
