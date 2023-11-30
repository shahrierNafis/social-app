"use client";
import { auth } from "@/firebase";
import { firestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect } from "react";
import { useMessageStore } from "@/useStore";
import ChatUI from "@/app/components/ChatUI";

function Page({ params }: { params: { uid: string } }) {
  const [user, loading, error] = useAuthState(auth);
  const [setRoom] = useMessageStore((state) => [state.setRoom]);
  useEffect(() => {
    if (!user) {
      return;
    }
    (async () => {
      try {
        let roomID = (
          await getDoc(doc(firestore, `users/${user?.uid}`))
        )?.data()?.rooms[params.uid];
        // check if the room exists
        if (!roomID) {
          // create the room
          const data = await (
            await fetch(`/room/${params.uid}/create`, {
              // send the user info for user verification
              body: JSON.stringify({
                token: await user?.getIdToken(),
                uid: user?.uid,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            })
          ).json();
          roomID = data.roomId;
        }
        const roomRef = doc(firestore, `rooms/${roomID}`);

        // set the room
        setRoom(roomRef); // set the room(roomRef);
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {};
  }, [params.uid, setRoom, user]);

  return (
    <>
      <ChatUI />
    </>
  );
}

export default Page;
