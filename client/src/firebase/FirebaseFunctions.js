import firebase from 'firebase/compat/app';
import { Navigate } from "react-router-dom";

async function doCreateUserWithEmailAndPassword(email, password, firstName) {
  const resp = await firebase.auth().createUserWithEmailAndPassword(email, password);
  if (resp?.additionalUserInfo?.isNewUser === true && resp?.user?.multiFactor?.user?.uid !== "") {
    await firebase.auth().currentUser.updateProfile({ displayName: firstName });
    return resp?.user?.multiFactor?.user?.uid;
  }
}

async function doChangePassword(email, oldPassword, newPassword) {
  let credential = firebase.auth.EmailAuthProvider.credential(
    email,
    oldPassword
  );
  await firebase.auth().currentUser.reauthenticateWithCredential(credential);
  await firebase.auth().currentUser.updatePassword(newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === 'google') {
    socialProvider = new firebase.auth.GoogleAuthProvider();
  } else if (provider === 'facebook') {
    socialProvider = new firebase.auth.FacebookAuthProvider();
  }
  const resp = await firebase.auth().signInWithPopup(socialProvider);
  if (resp?.additionalUserInfo?.isNewUser === true && resp?.user?.multiFactor?.user?.uid !== "") {
    return resp?.user?.multiFactor?.user?.uid;
  }
}

async function doPasswordReset(email) {
  await firebase.auth().sendPasswordResetEmail(email);
}

async function doPasswordUpdate(password) {
  await firebase.auth().updatePassword(password);
}

async function doSignOut() {
  await firebase.auth().signOut();
  <Navigate to='/' />;

}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doPasswordUpdate,
  doSignOut,
  doChangePassword
};
