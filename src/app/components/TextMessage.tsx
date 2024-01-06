import { QueryDocumentSnapshot } from "firebase/firestore";
import React from "react";
import { motion } from "framer-motion";
function TextMessage({
  message,
  ownMessage,
}: {
  message: QueryDocumentSnapshot;
  ownMessage: boolean;
}) {
  return (
    <>
      <motion.div
        animate={{ scale: [0.5, 1.2, 1] }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`relative text-sm py-2 px-4 shadow rounded-xl max-w-[16rem] break-words ${
            ownMessage ? "bg-zinc-700 mr-3" : "bg-zinc-600 ml-3"
          }`}
        >
          {message.data().text}
        </div>{" "}
      </motion.div>
    </>
  );
}

export default TextMessage;
