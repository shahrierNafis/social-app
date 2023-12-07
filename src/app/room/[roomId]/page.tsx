"use client";
import React, { useEffect, useRef } from "react";
import MessageList from "@/app/components/MessageList";
import TextInput from "@/app/components/TextInput";
import { useMessageStore } from "@/useStore";
import { doc } from "firebase/firestore";
import { firestore } from "@/firebase";

function Page({ params: { roomId } }: { params: { roomId: string } }) {
  const container = useRef<HTMLDivElement>(null);
  const [setRoom] = useMessageStore((state) => [state.setRoom]);

  //set room
  useEffect(() => {
    setRoom(doc(firestore, `rooms/${roomId}`));
  }, [roomId, setRoom]);

  // resize the container
  useEffect(() => {
    if (!container.current) {
      return;
    }
    container.current.style.height = `${
      window.innerHeight - container.current.offsetTop
    }px`;
  }, []);

  return (
    <>
      <div ref={container} className="flex flex-col">
        <div className="flex-auto">
          <MessageList />
        </div>
        <TextInput />
      </div>
    </>
  );
}

export default Page;