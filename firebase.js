import firebase from "firebase/app";
import database from "firebase/database";

var config = {
  apiKey: "AIzaSyBIRBZiovEXKtSAJbZsdLkLaTcMn9femZs",
  authDomain: "field-scan.firebaseapp.com",
  databaseURL: "https://field-scan.firebaseio.com",
  projectId: "field-scan",
  storageBucket: "field-scan.appspot.com",
  messagingSenderId: "349477094326",
  appId: "1:349477094326:web:fb47d88aab256a82953717",
};

let firebaseCache;

export const getFirebase = () => {
  if (firebaseCache) {
    return firebaseCache;
  }

  firebase.initializeApp(config);
  firebaseCache = firebase;
  return firebase;
};
