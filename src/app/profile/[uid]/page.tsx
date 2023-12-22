"use client";
import MessageBtn from "@/app/components/MessageBtn";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import getUser, { User } from "@/app/lib/getUser";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { usePresenceStore } from "@/useStore";
function Page({ params }: { params: { uid: string } }) {
  const [loading, setLoading] = useState(true);
  const [visitee, setVisitee] = useState<User>();
  const [user] = useAuthState(auth);
  const [onlineUsers] = usePresenceStore((state) => [state.onlineUsers]);
  useEffect(() => {
    if (user) {
      (async () => {
        setVisitee(await getUser(params.uid));
        setLoading(false);
      })();
    }

    return () => {};
  }, [params.uid, user]);

  return (
    <>
      {loading ? (
        "loading"
      ) : (
        <>
          <div className="text-3xl m-4">
            <Image
              className="rounded-full inline"
              src={visitee?.photoURL!}
              alt=""
              width={50}
              height={50}
            />
            {visitee?.displayName}
            {onlineUsers?.includes(params.uid) ? (
              <span className="text-green-500 text-xs">.Online</span>
            ) : (
              <span className="text-red-500 text-xs">.Offline</span>
            )}
          </div>
          <div className="mx-4">
            {" "}
            <MessageBtn uid={params.uid} />
          </div>
        </>
      )}
    </>
  );
}

export default Page;
