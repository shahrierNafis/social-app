import { QueryDocumentSnapshot } from "firebase/firestore";
import React from "react";

function TextMessage({
  message,
  ownMessage,
}: {
  message: QueryDocumentSnapshot;
  ownMessage: boolean;
}) {
  return (
    <>
      <div
        className={`relative text-sm py-2 px-4 shadow rounded-xl max-w-[16rem] break-words ${
          ownMessage ? "bg-gray-700 mr-3" : "bg-gray-600 ml-3"
        }`}
      >
        {message.data().text}
      </div>
    </>
  );
}

export default TextMessage;
