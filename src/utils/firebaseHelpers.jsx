import { setUserExtras, getUserExtras } from './auth';
import firebase from 'gatsby-plugin-firebase';

export const refreshUserExtras = (user) => {
  console.log('*************** refressUserExtras.....');
  // const db = firebase.getDatabase(

  //   'https://hyper-4fa6c.firebaseio.com/',
  // );
  // const ref = db.ref('/users');

  // Attach an asynchronous callback to read the data at our posts reference
  // ref.on(
  //   'value',
  //   (snapshot) => {
  //     setUserExtras(snapshot.val() || {});
  //   },
  //   (errorObject) => {
  //     console.log('The read failed: ' + errorObject.name);
  //   },
  // );
  // firebase
  //   .database()
  //   .ref('users/' + user.uid)
  //   .once('value', (snap) => {
  //     console.log(snap.val());
  //     setUserExtras(snap.val() || {});
  //     console.log(getUserExtras());
  //   });
  return setUserExtras([]);
};
