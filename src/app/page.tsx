"use client";
import { auth, firestore } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Virtuoso } from "react-virtuoso";
import Post from "./components/Post";
import useTimeline from "./hooks/useTimeline";

function Page() {
  const [user, loading] = useAuthState(auth);
  const [followingArray, setFollowingArray] = useState<string[]>([]);
  const [empty, setEmpty] = useState(false);
  const { posts, loadMore } = useTimeline(followingArray);
  useEffect(() => {
    if (user) {
      (async () => {
        getDocs(collection(firestore, `users/${user.uid}/following`)).then(
          (snapshots) => {
            if (snapshots.empty) setEmpty(true);
            setFollowingArray(
              snapshots.docs.map((doc) => {
                return doc.id;
              })
            );
          }
        );
      })();
    }
    return () => {};
  }, [user]);

  return (
    <>
      {empty ? (
        <div className="h-32 flex items-center justify-center">
          following users to see their posts here!
        </div>
      ) : loading ? (
        <>
          <div className="h-32 flex items-center justify-center">
            loading...
          </div>
        </>
      ) : (
        <>
          <Virtuoso
            useWindowScroll
            increaseViewportBy={window.innerHeight * 5}
            data={posts}
            itemContent={(index, post) => {
              return <Post key={post.id} {...{ post }} />;
            }}
            endReached={loadMore}
          />
        </>
      )}
    </>
  );
}

export default Page;
