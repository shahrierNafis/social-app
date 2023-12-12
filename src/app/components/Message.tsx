import { auth } from "@/firebase";
import { User } from "firebase/auth";
import { QueryDocumentSnapshot } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import getUser from "@/app/lib/getUser";
import TextMessage from "./TextMessage";
import ImageMessage from "./ImageMessage";
function Message({
  message,
  sameAuthor,
}: {
  message: QueryDocumentSnapshot;
  sameAuthor: boolean;
}) {
  const [author, setAuthor] = useState<User>();
  const [user] = useAuthState(auth);

  // get author data
  useEffect(() => {
    if (!user || sameAuthor) return;

    (async () => setAuthor(await getUser(user, message.data().author)))();

    return () => {};
  }, [message, sameAuthor, user]);

  const ownMessage = message.data().author == user?.uid;

  return (
    <>
      <div
        className={`flex items-center py-1 ${
          ownMessage ? "flex-row-reverse justify-start" : "flex-row"
        }`}
      >
        <div className="flex relative items-center justify-center h-8 w-8 rounded-full  flex-shrink-0">
          {!sameAuthor && (
            <Image
              className={`rounded-full h-full w-full ${
                ownMessage ? "bg-gray-700" : "bg-gray-600"
              }`}
              src={author?.photoURL || ""}
              alt=""
              fill
            />
          )}
        </div>

        {renderSwitch(message, ownMessage)}
      </div>
    </>
  );
}

export default Message;

function renderSwitch(message: QueryDocumentSnapshot, ownMessage: boolean) {
  switch (message.data().type) {
    case "text":
      return <TextMessage {...{ message, ownMessage }} />;
    case "image":
      return <ImageMessage {...{ message }} />;
    default:
      return "ERROR: Unknown message type!";
  }
}
