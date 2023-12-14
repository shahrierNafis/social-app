"use client";
import {
  DatabaseReference,
  onDisconnect,
  onValue,
  ref,
  set,
} from "firebase/database";
import { useEffect } from "react";
import { auth, database } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { usePresenceStore } from "@/useStore";
import { redirect, usePathname } from "next/navigation";

let userConnectedRef: DatabaseReference;
function Presence() {
  const [user, loading, error] = useAuthState(auth);
  const [setOnlineUsers] = usePresenceStore((state) => [state.setOnlineUsers]);
  //if not in Auth pages and not logged in
  if (!usePathname().match(/(sign-)\w+/) && !loading && !user) {
    redirect("/sign-in");
  }

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

  useEffect(() => {
    const userConnectedRef = ref(database, `connections`);
    onValue(userConnectedRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      // filter out the current user
      const uIDs = Object.keys(snapshot.val()).filter(
        (uid) => uid !== user?.uid
      );
      setOnlineUsers(uIDs);
    });
  }, [setOnlineUsers, user]);

  return <></>;
}

export default Presence;
