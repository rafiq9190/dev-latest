import React, { useState } from 'react';
import { Link } from 'gatsby';
import {
  getUser,
  isLoggedIn,
  logout,
  getUserType,
} from '../utils/auth';
import { FaRegUserCircle } from 'react-icons/fa';
import { Navbar, Nav, NavLink } from 'react-bootstrap';

const Header = ({ location }) => {
  const [isOpen, setisOpen] = useState(false);
  const [dropOpen, setdropOpen] = useState(false);

  const clickHandler = () => {
    setisOpen(!isOpen);
  };
  let loggedInUser = null;

  if (isLoggedIn()) {
    loggedInUser = getUser();
  }

  const plan = getUserType();

  return (
    <header className="mainHeader">
      <div className="container " style={{ paddingLeft: '7rem' }}>
        <div>
          <Navbar expand="sm">
            <Navbar.Brand href="/dashboard/">
              {/* <img src="/images/logo.png" /> */}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav as="ul">
                {isLoggedIn() && (
                  <>
                    <Nav.Item as="li">
                      <Link
                        to="/dashboard"
                        className={`nav-link ${
                          location.pathname === '/dashboard/'
                            ? 'active'
                            : ''
                        }`}
                      >
                        Pages
                      </Link>
                    </Nav.Item>
                    <Nav.Item as="li" disabled>
                      <NavLink eventKey="disabled" disabled>
                        <Link
                          to="dashboard/billing"
                          className={`nav-link`}
                        >
                          Pricing
                        </Link>
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <NavLink eventKey="disabled" disabled>
                        <Link
                          to="/dashboard/activate"
                          className={`nav-link ${
                            location.pathname ===
                            '/dashboard/activate'
                              ? 'active'
                              : ''
                          }`}
                        >
                          Activation
                        </Link>
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <a
                        href="https://www.airtable.com"
                        className={`nav-link`}
                        target="_blank"
                      >
                        Airtable
                      </a>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Link
                        to="/dashboard/logout"
                        className="nav-link"
                      >
                        Logout
                      </Link>
                    </Nav.Item>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
            {isLoggedIn() ? (
              <div className=" d-flex justify-content-between left-side">
                <div>
                  <button className="btn-trail">
                    Start free trail
                  </button>
                </div>
                <div>
                  <FaRegUserCircle
                    style={{
                      color: '#AFAFB5',
                      fontSize: '30px',

                      position: 'relative',
                    }}
                    onClick={clickHandler}
                  />

                  {isOpen ? (
                    <div className="header-action-dropdown">
                      <div className="header-action">
                        <i className="sw-user"></i>
                        <span className="user-details">
                          My account
                        </span>
                      </div>
                      <div className="header-action">
                        <i className="sw-dashboard"></i>
                        <span className="user-details">
                          Dashboard
                        </span>
                      </div>
                      <div className="header-action">
                        <i className="sw-power"></i>
                        <span className="user-details">Sign out</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            {/* <div className="head_right">
              <ul className="right_bar">
                <li>
                  <a>Current plan is : </a>
                  {plan}
                </li>
                
                <li>
                  <a href="javascript:void(0)">
                    <i className="fa fa-bell"></i>
                  </a>
                </li>
                {isLoggedIn() && (
                  <li>
                    <a
                      href="/dashboard/profile"
                      className="user"
                      title={
                        loggedInUser &&
                        (loggedInUser.displayname ||
                          loggedInUser.email)
                      }
                    >
                      <i className="fa fa-user"></i>
                    </a>
                  </li>
                )}
              </ul>
            </div> */}
          </Navbar>
        </div>
      </div>
    </header>
  );
};

export default Header;
