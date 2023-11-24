import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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
export { firestore, auth, database, app };
