import React, { useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Theme } from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";
import {
  CollectionReference,
  arrayUnion,
  doc,
  setDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";

function AddReaction({
  reactionsRef,
  user,
}: {
  reactionsRef: CollectionReference;
  user: User;
}) {
  const [open, setOpen] = useState(false);

  function onEmojiClick(emoji: EmojiClickData) {
    setDoc(
      doc(reactionsRef, emoji.emoji),
      { reactors: arrayUnion(user.uid) },
      { merge: true }
    );
    setOpen(false);
  }
  return (
    <>
      <button
        className="inline-block border rounded shadow m-1 p-1 px-3 flex-grow-0"
        onClick={() => setOpen(!open)}
      >
        ➕
      </button>
      {open && (
        <>
          {/*blurry background*/}
          <button
            className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur z-0"
            onClick={() => setOpen(false)}
            onKeyUp={(e) => e.key === "Escape" && setOpen(false)}
          ></button>
          {/* center the picker */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={Theme.DARK}
              emojiStyle={EmojiStyle.NATIVE}
              width={
                window.innerHeight > window.innerWidth
                  ? window.innerWidth * 1
                  : window.innerWidth * 0.4
              }
              height={window.innerHeight * 0.8}
              previewConfig={{ showPreview: window.innerWidth >= 1024 }}
            />
          </div>
        </>
      )}
    </>
  );
}

export default AddReaction;
