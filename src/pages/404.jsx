import React from "react"
import Layout from "../components/Layout"
import {Alert} from "react-bootstrap"

const NotFound = () => (
  <Layout>
	<Alert variant="light" className="align-center">
		<Alert.Heading>Page Not Found ... !!!</Alert.Heading>
		<div>You just hit a route that doesn&#39;t exist... the sadness.</div>
	</Alert>
  </Layout>
)

export default NotFound