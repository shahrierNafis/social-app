"use client";
import MessageBtn from "@/app/components/MessageBtn";
import React, { useEffect, useState } from "react";
import getUser, { User } from "@/app/lib/getUser";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { usePresenceStore } from "@/useStore";

import Image from "next/image";
import Link from "next/link";
import Posts from "@/app/components/Posts";
import FollowBtn from "@/app/components/FollowBtn";
import { Button } from "@/components/ui/button";

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
          <div className="m-4 text-3xl">
            {visitee?.photoURL ? (
              <Image
                className="inline rounded-full"
                src={visitee?.photoURL!}
                alt=""
                width={50}
                height={50}
              />
            ) : (
              <div className="rounded-full inline bg-zinc-900 w-[50] h-[50]"></div>
            )}
            <span className="break-words">{visitee?.displayName}</span>
            {visitee?.uid === user?.uid ? (
              <>
                <Link
                  className="text-xs text-yellow-700 hover:text-yellow-600"
                  href="/profile/edit"
                >
                  .edit
                </Link>
                <Link className="block m-2 max-w-fit" href="/sign-out">
                  <Button variant="destructive">Sign Out</Button>
                </Link>
              </>
            ) : (
              <>
                {onlineUsers?.includes(params.uid) ? (
                  <span className="text-xs text-green-500">.Online</span>
                ) : (
                  <span className="text-xs text-red-500">.Offline</span>
                )}
                <div className="mx-4">
                  <MessageBtn uid={params.uid} />
                  <FollowBtn uid={params.uid} />
                </div>
              </>
            )}
          </div>
          <Posts uid={params.uid}></Posts>
        </>
      )}
    </>
  );
}

export default Page;
