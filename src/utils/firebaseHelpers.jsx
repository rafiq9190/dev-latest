import { setUserExtras, getUserExtras } from './auth';
import firebase from 'gatsby-plugin-firebase';

export const refreshUserExtras = (user) => {
  console.log(
    '🚀 ~ file: firebaseHelpers.jsx ~ line 5 ~ refreshUserExtras ~ user',
    user,
  );
  console.log('*************** refressUserExtras.....');
  // firebase
  //   .database()
  //   .ref('users/' + user.uid)
  //   .once('value', (snap) => {
  //     console.log(snap.val());
  //     setUserExtras(snap.val() || {});
  //     console.log(getUserExtras());
  //   });
  return null;
};
