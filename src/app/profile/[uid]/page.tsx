"use client";
import MessageBtn from "@/app/components/MessageBtn";
import React, { useEffect, useState } from "react";
import getUser, { User } from "@/app/lib/getUser";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { usePresenceStore } from "@/useStore";

import Image from "next/image";
import Link from "next/link";

function Page({ params }: { params: { uid: string } }) {
  const [loading, setLoading] = useState(true);
  const [visitee, setVisitee] = useState<User>();
  const [user, loadingUser] = useAuthState(auth);
  const [onlineUsers] = usePresenceStore((state) => [state.onlineUsers]);
  useEffect(() => {
    if (user) {
      (async () => {
        setVisitee(await getUser(params.uid));
        setLoading(false || loadingUser);
      })();
    }

    return () => {};
  }, [loadingUser, params.uid, user]);

  useEffect(() => {
    setLoading((loading) => {
      return loading && loadingUser;
    });
  }, [loadingUser]);
  return (
    <>
      <></>

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
            {visitee?.uid === user?.uid ? (
              <>
                <Link
                  className="text-yellow-700 hover:text-yellow-600 text-xs"
                  href="/profile/edit"
                >
                  .edit
                </Link>
                <Link
                  className="block max-w-fit mx-4 m-1 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  href="/sign-out"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                {onlineUsers?.includes(params.uid) ? (
                  <span className="text-green-500 text-xs">.Online</span>
                ) : (
                  <span className="text-red-500 text-xs">.Offline</span>
                )}
                <div className="mx-4">
                  {" "}
                  <MessageBtn uid={params.uid} />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Page;
