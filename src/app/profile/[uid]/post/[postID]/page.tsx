"use client";
import { auth, firestore } from "@/firebase";
import { DocumentSnapshot, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import Comments from "@/app/components/Comments";
import Reactions from "@/app/components/Reactions";
import getUser, { User } from "@/app/lib/getUser";

type Post = {
  text: string;
  imageUrl?: string;
};
function Page({
  params: { uid, postID },
}: {
  params: { uid: string; postID: string };
}) {
  const [user, setUser] = useState<User>();
  const [post, setPost] = useState<DocumentSnapshot<Post>>();
  useEffect(() => {
    getDoc(doc(firestore, "users", uid, "posts", postID)).then((snapshot) =>
      setPost(snapshot as DocumentSnapshot<Post>)
    );
  }, [postID, uid]);

  useEffect(() => {
    getUser(uid).then(setUser);
  }, [uid]);
  return (
    <>
      {user && (
        <>
          <div className=" m-2 p-4 border shadow">
            {user.photoURL && (
              <Image
                className="rounded-full inline"
                src={user.photoURL}
                alt=""
                width={50}
                height={50}
              />
            )}
            {user?.displayName}
            <div className="break-words"> {post?.data()?.text}</div>

            {post?.data()?.imageUrl != undefined && (
              <div
                className="relative m-2 p-6 border shadow max-w-full max-h-screen 
               rounded overflow-hidden h-screen
              "
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full mx-auto object-scale-down"
                  src={post?.data()?.imageUrl!}
                  alt=""
                />
              </div>
            )}
            {post && <Reactions postRef={post.ref} />}
            {post && <Comments postRef={post.ref} />}
          </div>
        </>
      )}
    </>
  );
}

export default Page;
