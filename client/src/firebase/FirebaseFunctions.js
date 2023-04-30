import firebase from 'firebase/compat/app';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth();

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
  const resp = await firebase.auth().signInWithEmailAndPassword(email, password);
  if (resp?.user?.multiFactor?.user?.uid !== "") {
    return resp?.user?.multiFactor?.user?.uid;
  }
}

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === 'google') {
    socialProvider = new firebase.auth.GoogleAuthProvider();
  } else if (provider === 'facebook') {
    socialProvider = new firebase.auth.FacebookAuthProvider();
  }
  const resp = await firebase.auth().signInWithPopup(socialProvider);
  if (resp?.user?.multiFactor?.user?.uid !== "") {
    return resp?.user?.multiFactor?.user?.uid;
  }
}

async function doPasswordReset(email) {
  return sendPasswordResetEmail(auth, email).then((a) => {
  });
}

async function doPasswordUpdate(password) {
  await firebase.auth().updatePassword(password);
}

async function doSignOut() {
  // let navigate = useNavigate();
  await firebase.auth().signOut();
  localStorage.removeItem("userData");
  window.location.href = "/";
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
