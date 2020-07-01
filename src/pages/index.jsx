import React from "react"
import Layout from "../components/Layout"
import { Button } from 'react-bootstrap';
import { isLoggedIn} from "../utils/auth"

const Index = () => {
  
  return (
  <Layout>
    {!isLoggedIn() && 
      <Button variant="primary" href="/dashboard/login">Login with Firebase</Button>
    }
    <h1>HyperLyst Homepage</h1>
    <h2>This space is reserved for homepage of this site</h2>
  </Layout>
)
}
export default Index
