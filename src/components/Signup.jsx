import firebase from 'gatsby-plugin-firebase';

import React, { useState } from 'react';
import { navigate } from '@reach/router';
import { Link } from 'gatsby';
import { setUser, isLoggedIn, setUserExtras } from '../utils/auth';
import GoogleImage from '../images/google.jpg';
import { Form } from 'react-bootstrap';
import Toasty from './Toast';

function Signup() {
  const auth = firebase.auth();

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const [isProcessing, setProcessing] = useState(false);

  if (isLoggedIn()) {
    navigate(`/`);
  }

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setProcessing(true);
    try {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);
      firebase
        .database()
        .ref('users/' + result.user.uid)
        .once('value', (snap) => {
          setUserExtras(snap.val() || {});
        });
      setUser(result.user);
    } catch (err) {
      <Toasty data={err.message} />;
    }

    setProcessing(false);
  };
  const signInWithGoogle = () => {
    auth
      .signInWithPopup(googleProvider)
      .then((res) => {
        setUser(res.user);
        navigate('/');
      })
      .catch((error) => {
        <Toasty data={error.message} />;
      });
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <p
            style={{
              fontSize: '32px',
              color: '#5a5d63',
              textAlign: 'center',
              padding: '1rem',
            }}
          >
            Sign up for free and start building in minutes
          </p>

          <Form>
            <Form.Control
              type="text"
              placeholder="Full Name"
              className="bg-light"
              name="name"
              value={data.name}
              onChange={handleChange}
            />
            <br />
            <Form.Control
              type="text"
              placeholder="Email"
              className="bg-light"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
            <br></br>
            <Form.Control
              type="password"
              placeholder="Password"
              className="bg-light"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
            <br />
            <div className="d-flex">
              <Form.Check type="checkbox" id="" label={``} />
              <span>
                I accept the{' '}
                <Link
                  to=""
                  style={{ color: '#6F87D5', cursor: 'pointer' }}
                >
                  terms and conditions
                </Link>
              </span>
            </div>
            <br></br>
            <div
              className="d-grid gap-2 text-center form-btn"
              onClick={handleRegister}
              disabled={isProcessing}
            >
              {!isProcessing ? (
                ' Sign up for free'
              ) : (
                <div className="spinner-grow spinner-grow-sm"></div>
              )}
            </div>
          </Form>

          <p style={{ textAlign: 'center', margin: '10px' }}>or</p>
          <div className="google-auth">
            <div>
              <img
                src={GoogleImage}
                alt="A google"
                width={20}
                height={20}
              />
            </div>
            <span
              style={{ marginLeft: '1rem' }}
              onClick={signInWithGoogle}
            >
              Sign up with Google
            </span>
          </div>
          <br></br>
          <p className="text-center">
            Already have an account?{' '}
            <span>
              <Link
                style={{ color: '#6F87D5' }}
                to="/dashboard/login"
              >
                Login
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
