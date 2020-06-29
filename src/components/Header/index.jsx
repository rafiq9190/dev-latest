import React, {useState} from "react"
import { Link } from "gatsby"
import { navigate } from "@reach/router"
import { Navbar, Nav, NavDropdown, Form, InputGroup, FormControl } from 'react-bootstrap';
import { getUser, isLoggedIn, logout } from "../../utils/auth"
import firebase from "gatsby-plugin-firebase"


const Header = () => {
  let loggedInUser = null;

  if(isLoggedIn()){
    loggedInUser = getUser();
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="sticky-top">
        <Navbar.Brand href="/">
          {' '}HYPER<span className="text-primary">LYST</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {!isLoggedIn() &&
              <Nav.Link href="/app/login">Login</Nav.Link>
            }
            {isLoggedIn() &&
              <NavDropdown title={loggedInUser && (loggedInUser.displayname || loggedInUser.email)} id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <div className="navbar-login">
                    <div className="row">
                      <div className="col-lg-12">
                        <p className="text-left"> 
                          <button className="btn btn-success btn-block btn-sm" onClick={()=>navigate(`/app/projects`)}>
                            Admin Console
                          </button>
                          <button className="btn btn-primary btn-block btn-sm" onClick={()=>navigate(`/app/profile`)}>
                            View Profile
                          </button>
                          <button className="btn btn-secondary btn-block btn-sm" onClick={()=>navigate(`/app/activate`)}>
                            Activate Subscription
                          </button>
                          <button className="btn btn-warning btn-block btn-sm" onClick={event => { event.preventDefault(); logout(firebase).then(() => navigate(`/`)) }}>
                            Logout
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </NavDropdown.Item>
              </NavDropdown>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

export default Header
