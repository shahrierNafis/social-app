"use client";
import MessageBtn from "@/app/components/MessageBtn";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "firebase/auth";
import getUser from "@/app/lib/getUser";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { database } from "@/firebase";
import { onValue, ref } from "firebase/database";
function Page({ params }: { params: { uid: string } }) {
  const [loading, setLoading] = useState(true);
  const [visitee, setVisitee] = useState<User>();
  const [user] = useAuthState(auth);
  const [online, setOnline] = useState<boolean>(false);
  useEffect(() => {
    if (user) {
      (async () => {
        setVisitee(await getUser(user, params.uid));
        setLoading(false);
      })();
    }

    return () => {};
  }, [params.uid, user]);
  useEffect(() => {
    const userConnectedRef = ref(database, `connections`);
    onValue(userConnectedRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      // filter out the current user
      const uIDs = Object.keys(snapshot.val());
      if (uIDs.includes(params.uid)) {
        setOnline(true);
      } else {
        setOnline(false);
      }
    });
  }, [params.uid]);
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
            {online ? (
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
