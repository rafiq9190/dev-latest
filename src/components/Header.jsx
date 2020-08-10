import React, { useState } from "react"
import { Link } from "gatsby"
import { getUser, isLoggedIn, logout } from "../utils/auth"
import { Navbar, Nav } from 'react-bootstrap';


const Header = ({ location }) => {
    let loggedInUser = null;

    if (isLoggedIn()) {
        loggedInUser = getUser();
    }

    return (
        <header className="mainHeader">
            <div className="container">
                <Navbar expand="sm">
                    <Navbar.Brand href="/dashboard/"><img src="/images/logo.png" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav as="ul">
                            {isLoggedIn() &&
                                <>
                                    <Nav.Item as="li">
                                        <Link to="/dashboard/" className={`nav-link ${location.pathname === '/dashboard/' ? 'active' : ''}`}>Pages</Link>
                                    </Nav.Item>
                                    <Nav.Item as="li">
                                        <Link to="/dashboard/activate" className={`nav-link ${location.pathname === '/dashboard/activate' ? 'active' : ''}`}>Activation</Link>
                                    </Nav.Item>
                                    <Nav.Item as="li">
                                        <a href="https://www.airtable.com" className={`nav-link`} target="_blank">Airtable</a>
                                    </Nav.Item>
                                    <Nav.Item as="li">
                                        <Link to="/dashboard/logout" className="nav-link">Logout</Link>
                                    </Nav.Item>
                                </>
                            }
                        </Nav>
                    </Navbar.Collapse>
                    <div className="head_right">
                        <ul className="right_bar">
                            <li><a href="javascript:void(0)">HELP <span>?</span></a></li>
                            <li><a href="javascript:void(0)"><i className="fa fa-bell"></i></a></li>
                            {isLoggedIn() &&
                                <li><a href="/dashboard/profile" className="user" title={loggedInUser && (loggedInUser.displayname || loggedInUser.email)}><i className="fa fa-user"></i></a></li>
                            }
                        </ul>
                    </div>
                </Navbar>
            </div>
        </header>
    )
}

export default Header
