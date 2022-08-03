import React, { useState } from 'react';
import { navigate } from '@reach/router';
import firebase from 'gatsby-plugin-firebase';
import { Link } from 'gatsby';
import Toasty from './Toast';
import { setUser, setUserExtras, isLoggedIn } from '../utils/auth';

import GoogleImage from '../images/google.jpg';
import { Form } from 'react-bootstrap';

const Login = () => {
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
  const handleLogin = async (e) => {
    e.preventDefault();

    setProcessing(true);
    try {
      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password);
      firebase
        .database()
        .ref('users/' + result.user.uid)
        .once('value', (snap) => {
          setUserExtras(snap.val() || {});
        });
      setUser(result.user);
      navigate('/dashboard');
    } catch (err) {
      <Toasty data={err.message} />;
    }

    setProcessing(false);
  };

  const signInWithGoogle = () => {
    const auth = firebase.auth();
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(googleProvider)
      .then((res) => {
        setUser(res.user);
        navigate('/dashboard');
      })
      .catch((error) => {
        <Toasty data={error.message} />;
      });
  };

  // function getUiConfig(auth) {
  //   return {
  //     signInFlow: 'popup',
  //     signInOptions: [
  //       auth.GoogleAuthProvider.PROVIDER_ID,
  //       auth.EmailAuthProvider.PROVIDER_ID,
  //     ],
  //     // signInSuccessUrl: '/',
  //     callbacks: {
  //       signInSuccessWithAuthResult: (result) => {

  //         firebase
  //           .database()
  //           .ref('users/' + result.user.uid)
  //           .once('value', (snap) => {
  //             setUserExtras(snap.val() || {});
  //           });
  //         setUser(result.user);
  //         navigate('/');
  //       },
  //     },
  //   };
  // }

  return (
    <div className="container">
      <div className="row">
        <div
          className="col-md-6 offset-md-3 my-3"
          style={{ marginTop: '134px' }}
        >
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
              Sign in with Google
            </span>
          </div>
          <p className="text-center m-1">or</p>

          <Form>
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

            <br></br>
            <div
              className="d-grid gap-2 text-center form-btn"
              onClick={handleLogin}
              disabled={isProcessing}
            >
              {!isProcessing ? (
                ' Sign in'
              ) : (
                <div className="spinner-grow spinner-grow-sm"></div>
              )}
            </div>
          </Form>

          <br></br>
          <p
            style={{
              textAlign: 'center',
              margin: '1rem',
              color: '#6F87D5',
              cursor: 'pointer',
            }}
          >
            <Link>Forget password?</Link>
          </p>
          <p className="text-center">
            Haven’t got an account?{' '}
            <span>
              <Link
                style={{ color: '#6F87D5' }}
                to="/dashboard/signup"
              >
                Sign Up
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
