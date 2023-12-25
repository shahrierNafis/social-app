"use client";
import { auth, firestore } from "@/firebase";
import { DocumentSnapshot, deleteDoc, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import Comments from "@/app/components/Comments";
import Reactions from "@/app/components/Reactions";
import getUser, { User } from "@/app/lib/getUser";
import Button from "react-bootstrap/Button";
import PostData from "@/app/types/PostData";
import { useRouter } from "next/navigation";

function Page({
  params: { uid, postID },
}: {
  params: { uid: string; postID: string };
}) {
  const [user, setUser] = useState<User>();
  const [post, setPost] = useState<DocumentSnapshot<PostData>>();
  const router = useRouter();
  useEffect(() => {
    getDoc(doc(firestore, "users", uid, "posts", postID)).then((snapshot) =>
      setPost(snapshot as DocumentSnapshot<PostData>)
    );
  }, [postID, uid]);

  useEffect(() => {
    getUser(uid).then(setUser);
  }, [uid]);
  return (
    <>
      {user && (
        <>
          <div className=" sm:m-2 sm:p-4 p-2 border shadow">
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
            {post?.data()?.timestamp && (
              <span className="text-gray-400 text-xs">
                {" "}
                {post?.data()?.timestamp.toDate().toDateString()}
              </span>
            )}
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
            {post && auth.currentUser?.uid === uid && (
              <Button
                variant="danger"
                className="m-2 float-right block"
                onClick={() => {
                  deleteDoc(post?.ref).then(() =>
                    router.push("/profile/" + uid)
                  );
                }}
              >
                Delete Post
              </Button>
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
