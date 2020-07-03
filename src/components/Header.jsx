import React, { useState } from "react"
import { Link } from "gatsby"
import { navigate } from "@reach/router"
import { getUser, isLoggedIn, logout } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"
import { Avatar } from "evergreen-ui"


const Header = ({ location }) => {
    let loggedInUser = null;

    if (isLoggedIn()) {
        loggedInUser = getUser();
    }

    return (
        <header className="mainHeader">
            <div className="container">
                <nav className="navbar navbar-expand-sm">
                    <a className="navbar-brand" href="/dashboard/"><img src="/images/logo.png" /></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                        <img src="/images/toggle.png" />
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            {isLoggedIn() &&
                                <>
                                    <li className="nav-item">
                                        <Link to="/dashboard/" className={`nav-link ${location.pathname === '/dashboard/' ? 'active' : ''}`}>Pages</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/dashboard/activate" className={`nav-link ${location.pathname === '/dashboard/activate' ? 'active' : ''}`}>Activation</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/dashboard/logout" className="nav-link">Logout</Link>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                    <div className="head_right">
                        <ul className="right_bar">
                            <li><a href="javascript:void(0)">HELP <span>?</span></a></li>
                            <li><a href="javascript:void(0)"><i className="fa fa-bell"></i></a></li>
                            {isLoggedIn() &&
                                <li><a href="/dashboard/profile" className="user" title={loggedInUser && (loggedInUser.displayname || loggedInUser.email)}><i className="fa fa-user"></i></a></li>
                            }
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header