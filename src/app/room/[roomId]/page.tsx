"use client";
import React, { useEffect, useRef } from "react";
import MessageList from "@/app/components/MessageList";
import TextInput from "@/app/components/TextInput";
import { useRoomStore } from "@/useStore";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getUser from "@/app/lib/getUser";

function Page({ params: { roomId } }: { params: { roomId: string } }) {
  const container = useRef<HTMLDivElement>(null);
  const [setRoom] = useRoomStore((state) => [state.setRoom]);
  const [room] = useRoomStore((state) => [state.room]);
  const [setRoomName] = useRoomStore((state) => [state.setRoomName]);
  const [setRoomNameLink] = useRoomStore((state) => [state.setRoomNameLink]);
  const [setRoomImage] = useRoomStore((state) => [state.setRoomImage]);
  const [user, loading, error] = useAuthState(auth);

  //set room
  useEffect(() => {
    const room = doc(firestore, `rooms/${roomId}`);
    setRoom(room);
  }, [roomId, setRoom]);

  // set room info
  useEffect(() => {
    if (!user || !room) {
      return;
    }
    getDoc(room).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.data().members.forEach((member: string) => {
          if (member !== user?.uid) {
            getUser(member).then((UserRecord) => {
              setRoomName(UserRecord.displayName);
              setRoomNameLink(`/profile/${UserRecord.uid}`);
              setRoomImage(UserRecord.photoURL);
            });
          }
        });
      }
    });

    return () => {};
  }, [room, setRoomImage, setRoomName, setRoomNameLink, user]);

  return (
    <>
      <div ref={container} className="flex flex-col h-full">
        <MessageList />
        <TextInput />
      </div>
    </>
  );
}

export default Page;
