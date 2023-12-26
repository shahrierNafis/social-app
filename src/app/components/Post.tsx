import { QueryDocumentSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import PostData from "../types/PostData";
import getUser, { User } from "../lib/getUser";
import Image from "next/image";
import Reactions from "./Reactions";
import Link from "next/link";
function Post({ post }: { post: QueryDocumentSnapshot<PostData> }) {
  const [author, setAuthor] = useState<User>();
  useEffect(() => {
    getUser(post.data().author).then(setAuthor);
  }, [post]);
  return (
    <>
      {author ? (
        <>
          <div className="sm:m-16 p-2 sm:p-4 border shadow rounded">
            {/* photo, name and timestamp */}
            <Link href={`/profile/${author.uid}`}>
              {author.photoURL && (
                <Image
                  className="rounded-full inline"
                  src={author.photoURL}
                  alt=""
                  width={50}
                  height={50}
                />
              )}
              <span className="break-words">{author?.displayName}</span>
            </Link>
            {post?.data()?.timestamp && (
              <span className="text-gray-400 text-xs">
                {" "}
                {post?.data()?.timestamp.toDate().toDateString()}
              </span>
            )}
            {/* body */}
            <Link href={`/profile/${author.uid}/post/${post.id}`}>
              <div className="break-words"> {post?.data()?.text}</div>

              {post?.data()?.imageUrl != undefined && (
                <div
                  className="relative m-2 p-6 border shadow max-w-full max-h-[50vh] 
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
            </Link>
            {/* Reactions */}
            {post && <Reactions postRef={post.ref} />}
          </div>
        </>
      ) : (
        "loading"
      )}
    </>
  );
}

export default Post;
