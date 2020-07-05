import React from "react"
import { navigate } from '@reach/router';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { setUser, setUserExtras, isLoggedIn } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"

const Login = () => {

  if (isLoggedIn()) {
    navigate(`/`)
  }

  function getUiConfig(auth) {
    return {
      signInFlow: 'popup',
      signInOptions: [
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.EmailAuthProvider.PROVIDER_ID
      ],
      // signInSuccessUrl: '/',
      callbacks: {
        signInSuccessWithAuthResult: (result) => {
          firebase.database().ref('users/' + result.user.uid).once("value", snap => {
            setUserExtras(snap.val() || {})
          })
          setUser(result.user);
          navigate('/');
        }
      }
    };
  }

  return (
    <div className="container w-100 mx-auto">
      <div className="row">
        <div className="col-lg-2">&nbsp;</div>
        <div className="col-lg-8 bg-light p-4">
          <h1>Dashboard Login</h1>
          <p>Please sign-in to access your pages:</p>
          {firebase && <StyledFirebaseAuth uiConfig={getUiConfig(firebase.auth)} firebaseAuth={firebase.auth()} />}
        </div>
        <div className="col-lg-2">&nbsp;</div>
      </div>
    </div>
  );

}

export default Login
