import { useMessageStore } from "@/useStore";
import { auth } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import AttachBtn from "./AttachBtn";
import Emoji from "./Emoji";

function TextInput() {
  const [text, setText] = useState("");
  const [room] = useMessageStore((state) => [state.room]);
  const [user, loading, error] = useAuthState(auth);
  /**
   * Handles the click event for a button.
   *
   * If the room variable is falsy, the function returns early.
   * Otherwise, a new document is added to the "messages" collection in the specified room,
   * containing the provided text and the UID of the current user as the author.
   * Finally, the text variable is cleared.
   */
  function onClick() {
    if (!room || text === "") {
      return;
    }

    addDoc(collection(room, "messages"), {
      text: text,
      author: user?.uid,
    });

    setText("");
  }
  return (
    <>
      <div className="flex flex-row items-center h-16 rounded-xl bg-blend-darken w-full px-4">
        <AttachBtn />
        <div className="flex-grow ml-4">
          <div className="relative w-full">
            <input
              type="text"
              className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
              autoComplete="off"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Emoji />
          </div>
        </div>
        <div className="ml-4">
          <button
            onClick={onClick}
            className=" flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
          >
            <span>Send</span>
            <span className="ml-2 relative w-5 h-5 ">
              <Image
                src="/send.svg"
                alt=""
                className="transform rotate-45 -mt-px"
                fill
              />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default TextInput;
