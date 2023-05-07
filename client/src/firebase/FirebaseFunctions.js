import firebase from 'firebase/compat/app';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth();

async function doSignOut(error) {
  if (error !== "") {
    await firebase.auth().signOut();
    localStorage.removeItem("userData");
    localStorage.clear();
  } else {
    await firebase.auth().signOut();
    localStorage.removeItem("userData");
    localStorage.clear();
    window.location.href = "/";
  }
}

async function doCreateUserWithEmailAndPassword(email, password, firstName) {
  try {
    const resp = await firebase.auth().createUserWithEmailAndPassword(email, password);
    if (resp?.additionalUserInfo?.isNewUser === true && resp?.user?.multiFactor?.user?.uid !== "") {
      await firebase.auth().currentUser.updateProfile({ displayName: firstName });
      return { uid: resp?.user?.multiFactor?.user?.uid, error: null };
    }
  } catch (e) {
    return { uid: "", code: e?.code, error: e?.message };
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
  try {
    const resp = await firebase.auth().signInWithEmailAndPassword(email, password);
    if (resp?.user?.multiFactor?.user?.uid !== "") {
      return { uid: resp?.user?.multiFactor?.user?.uid, error: null };
    }
  } catch (e) {
    return { uid: "", code: e?.code, error: e?.message };
  }
}

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === 'google') {
    socialProvider = new firebase.auth.GoogleAuthProvider();
  } else if (provider === 'facebook') {
    socialProvider = new firebase.auth.FacebookAuthProvider();
  }
  try {
    const resp = await firebase.auth().signInWithPopup(socialProvider);
    if (resp?.user?.multiFactor?.user?.uid !== "") {
      return { uid: resp?.user?.multiFactor?.user?.uid, error: null };
    }
  } catch (e) {
    return { uid: "", code: e?.code, error: e?.message };
  }

}

async function doPasswordReset(email) {
  try {
    const resp = await sendPasswordResetEmail(auth, email);
    return { resp: "success" };
  } catch (e) {
    return { code: e?.code, error: e?.message };
  }
}

async function doPasswordUpdate(password) {
  await firebase.auth().updatePassword(password);
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
