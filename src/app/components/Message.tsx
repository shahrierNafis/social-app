import { auth } from "@/firebase";
import { User } from "firebase/auth";
import { QueryDocumentSnapshot } from "firebase/firestore";
import Image from "next/image";
import React, { cache, use, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import getUser from "@/app/lib/getUser";
import { useMessageStore } from "@/useStore";
function Message({
  message,
  sameAuthor,
}: {
  message: QueryDocumentSnapshot;
  sameAuthor: boolean;
}) {
  const [author, setAuthor] = useState<User>();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user || sameAuthor) return;

    (async () => setAuthor(await getUser(user, message.data().author)))();

    return () => {};
  }, [message, sameAuthor, user]);

  return (
    <>
      {user && user.uid == message.data().author ? (
        <div className="flex items-center justify-start flex-row-reverse py-1">
          <div className="flex relative items-center justify-center h-8 w-8 rounded-full  flex-shrink-0">
            {!sameAuthor && (
              <Image
                className="rounded-full h-full w-full"
                src={author?.photoURL || ""}
                alt=""
                fill
              />
            )}
          </div>
          <div className="relative mr-3 text-sm bg-gray-700 py-2 px-4 shadow rounded-xl max-w-[16rem] break-words">
            {message.data().text}
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center  py-1">
          <div className="flex relative items-center justify-center h-8 w-8 rounded-full  flex-shrink-0">
            {!sameAuthor && (
              <Image
                className="rounded-full h-full w-full"
                src={author?.photoURL || ""}
                alt=""
                fill
              />
            )}
          </div>
          <div className="relative ml-3 text-sm bg-gray-600 py-2 px-4 shadow rounded-xl max-w-[16rem] break-words">
            {message.data().text}
          </div>
        </div>
      )}
    </>
  );
}

export default Message;
