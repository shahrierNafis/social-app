import { QueryDocumentSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import React from "react";

function ImageMessage({ message }: { message: QueryDocumentSnapshot }) {
  return (
    <>
      <motion.div animate={{ scale: [0, 1] }}>
        <div className="max-w-[16rem] rounded border max-h-[100vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={message.data().imageUrl}
            alt=""
            className="w-[100%] h-[100%] object-scale-down"
          />
        </div>
      </motion.div>
    </>
  );
}

export default ImageMessage;
