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
  const user = await GooglePlus.login({
    scopes: '',
    webClientId: firebaseConfig.webClientType3,
    offline: true
  });
  console.log(user);
  return user;
}

export const logout = async () => {
  return await firebase.auth().signOut();
}
