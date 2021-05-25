import firebase from "firebase/app";

const googleProvider = new firebase.auth.GoogleAuthProvider();

export const loginWithGoogle = async () => {
  return await firebase.auth().signInWithPopup(googleProvider);
}

export const logout = async () => {
  return await firebase.auth().signOut();
}
