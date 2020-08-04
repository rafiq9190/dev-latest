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
        <div className="col bg-white p-4 text-center">
          <h1>Login</h1>
          <p>Please sign-in for the access</p>
          {firebase && <StyledFirebaseAuth uiConfig={getUiConfig(firebase.auth)} firebaseAuth={firebase.auth()} />}
        </div>
      </div>
    </div>
  );

}

export default Login
