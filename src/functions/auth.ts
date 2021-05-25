import { Capacitor } from '@capacitor/core';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from "firebase/app";

import firebaseConfig from '../firebaseConfig';

const googleProvider = new firebase.auth.GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const platform = Capacitor.getPlatform();
  if (platform === 'web') {
    // Usar popup en web (Navegador)
    return await firebase.auth().signInWithPopup(googleProvider);
  }
  const userCredential: { idToken: string } = await GooglePlus.login({
    scopes: '',
    webClientId: firebaseConfig.webClientType3,
    offline: true
  });
  return firebase.auth().signInWithCredential(
    firebase.auth.GoogleAuthProvider.credential(userCredential.idToken)
  )
}

export const logout = async () => {
  return await firebase.auth().signOut();
}
