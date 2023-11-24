"use client";
import { DatabaseReference, onDisconnect, ref, set } from "firebase/database";
import { useEffect } from "react";
import { auth, database } from "@/firebase";

let userConnectedRef: DatabaseReference;
function Presence() {
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        userConnectedRef = ref(database, `connections/${user.uid}`);
        onDisconnect(userConnectedRef)
          .remove() //set offline on disconnect
          .then(() => {
            //mark online.
            set(userConnectedRef, true);
          });
      }
    });
    return () => {};
  }, []);
  return <></>;
}

export default Presence;
