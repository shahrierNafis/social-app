import {
  query,
  orderBy,
  limit,
  QueryDocumentSnapshot,
  getDocs,
  collection,
  Timestamp,
  startAfter,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import PostData from "../types/PostData";
import { firestore } from "@/firebase";

export type Posts = QueryDocumentSnapshot<PostData>;
function useTimeline(uidArr: string[]) {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [postIdArr, setPostIdArr] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<{ [key: string]: Timestamp }>({});
  const quantity = 1;

  const loadMore = useCallback(
    (lastItemIndex: number) => {
      uidArr.forEach((uid) => {
        getDocs(
          query(
            collection(firestore, `users/${uid}/posts`),
            orderBy("timestamp", "desc"),
            startAfter(timestamp[uid] || Timestamp.now()),
            limit(quantity)
          )
        ).then((snapshot) => {
          setLoading(false);
          snapshot
            .docChanges()
            .toReversed()
            .forEach((change) => {
              console.log("read", change.doc.id);

              if (
                change.type === "added" &&
                (posts.length == 0 || change.doc.id != posts[lastItemIndex].id)
              ) {
                // update timestamp
                setTimestamp((timestamp) => {
                  return {
                    ...timestamp,
                    [uid]: change.doc.data().timestamp,
                  };
                });
                // add post
                setPostIdArr((postIdArr) => {
                  return [...postIdArr, change.doc.id];
                });
                setPosts((posts) => {
                  return [...posts, change.doc as Posts];
                });
              }
            });
        });
      });
    },
    [posts, timestamp, uidArr]
  );

  useEffect(() => {
    if (posts.length == 0) loadMore(0);
  }, [loadMore, posts]);

  return { posts, loadMore, loading };
}

export default useTimeline;
