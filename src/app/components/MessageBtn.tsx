"use client";
import { auth } from "@/firebase";
import { firestore } from "@/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";
function MessageBtn({ uid }: { uid: string }) {
  const [user, loading, error] = useAuthState(auth);
  const [link, setLink] = useState<String>("");
  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = onSnapshot(
      doc(firestore, `users/${user?.uid}/conversations/${uid}`),
      async (snapshot) => {
        let roomID = snapshot?.data()?.roomId;
        if (roomID) {
          setLink(`/room/${roomID}`); // set the room(roomRef);
        } else {
          const roomId = uuidv4();

          // create the room
          setDoc(doc(firestore, "rooms/" + roomId), {
            members: [uid, user.uid],
          });

          setDoc(
            doc(firestore, `users/${user.uid}/conversations/${uid}`),
            {
              roomId,
            },
            { merge: true }
          );

          setDoc(
            doc(firestore, `users/${uid}/conversations/${user.uid}`),
            {
              roomId,
            },
            { merge: true }
          );
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, [uid, user]);
  return (
    <>
      {link === "" ? (
        <button className="py-2.5 px-5 me-2 mb-2 text-sm font-medium  rounded-lg border  bg-gray-800 text-gray-400 border-gray-600 !cursor-wait">
          Message
        </button>
      ) : (
        <Link href={link as Url}>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Message
          </button>
        </Link>
      )}
    </>
  );
}

export default MessageBtn;
