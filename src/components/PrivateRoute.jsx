import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { isLoggedIn } from '../utils/auth';

const PrivateRoute = ({
  component: Component,
  location,
  ...rest
}) => {
  if (!isLoggedIn() && location.pathname !== `/dashboard/signup`) {
    // If we’re not logged in, redirect to the home page.
    navigate(`/dashboard/signup`, { replace: true });
    return null;
  }

  return <Component location={location} {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

export default PrivateRoute;
