import { getApp, getApps, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// replace this firebase conFigvariable with your own
const firebaseConfig = {
  apiKey: "AIzaSyBLXLqa3TD5UC8-fC-PtsiyZLvWlerPMOs",
  authDomain: "messaging-app-405702.firebaseapp.com",
  databaseURL: "https://messaging-app-405702-default-rtdb.firebaseio.com/",

  projectId: "messaging-app-405702",
  storageBucket: "messaging-app-405702.appspot.com",
  messagingSenderId: "795658014933",
  appId: "1:795658014933:web:06a0f35e1374a72693525c",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);

function inDevelopment() {
  if (typeof window === "undefined") {
    return false;
  }
  return (
    location.hostname === "localhost" || location.hostname === "192.168.1.7"
  );
}

if (inDevelopment()) {
  console.log("connecting to firestore emulator");
  connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
}

export { firestore, auth, database, app };
