import React, { useState } from "react"
import { Link } from "gatsby"
import { navigate } from "@reach/router"
import { getUser, isLoggedIn, logout } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"


const Header = () => {
    let loggedInUser = null;

    if (isLoggedIn()) {
        loggedInUser = getUser();
    }

    return (
        <header className="mainHeader">
            <div className="container">
                <nav className="navbar navbar-expand-sm">
                    <a className="navbar-brand" href="javascript:void(0)"><img src="images/logo.png" /></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                        <img src="images/toggle.png" />
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active" href="javascript:void(0)">Bases</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="javascript:void(0)">Templates</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="javascript:void(0)">Universe</a>
                            </li>
                        </ul>
                    </div>
                    <div className="head_right">
                        <ul className="right_bar">
                            <li><a href="javascript:void(0)">HELP <span>?</span></a></li>
                            <li><a href="javascript:void(0)"><i className="fa fa-bell"></i></a></li>
                            <li><a href="javascript:void(0)" className="user"><i className="fa fa-user"></i></a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header
