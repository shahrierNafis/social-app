"use client";
import React, { useEffect, useRef } from "react";
import MessageList from "./MessageList";
import TextInput from "./TextInput";

function ChatUI() {
  const container = useRef<HTMLDivElement>(null);

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

export default ChatUI;
