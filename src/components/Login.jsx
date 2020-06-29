import React from "react"
import { navigate } from '@reach/router';
import View from "./View"
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
    <View title="Log In">
      <p>Please sign-in to access the projects:</p>
      {firebase && <StyledFirebaseAuth uiConfig={getUiConfig(firebase.auth)} firebaseAuth={firebase.auth()}/>}
    </View>
  );

}

export default Login
