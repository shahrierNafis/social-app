import {
  onSnapshot,
  query,
  orderBy,
  limit,
  QueryDocumentSnapshot,
  getDocs,
  startAfter,
  startAt,
  endAt,
  collection,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import PostData from "../types/PostData";
import { firestore } from "@/firebase";

export type Posts = QueryDocumentSnapshot<PostData>;

export default function usePosts(uid: string) {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);
  const quantity = 10;

  // handle initial and new posts
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, `users/${uid}/posts`),
        orderBy("timestamp", "desc"),
        limit(quantity)
      ),
      (snapshot) => {
        setLoading(false);
        snapshot
          .docChanges()
          .toReversed()
          .forEach((change) => {
            if (change.type === "added") {
              setPosts((posts) => {
                return [change.doc as Posts, ...posts];
              });
            }
          });
      }
    );
    return unsubscribe;
  }, [uid]);

  const loadMore = useCallback(
    (lastItemIndex: number) => {
      getDocs(
        query(
          collection(firestore, `users/${uid}/posts`),

          orderBy("timestamp", "desc"),
          startAfter(posts[lastItemIndex].data().timestamp),
          limit(quantity)
        )
      ).then((snapshot) => {
        setLoading(false);
        if (snapshot.empty) {
        } else if (snapshot.docs[0].id !== posts[0].id) {
          snapshot.docs.forEach((doc) => {
            setPosts((posts) => {
              return [...posts, doc as Posts];
            });
          });
        }
      });
    },
    [uid, posts]
  );

  return { posts, loadMore, loading };
}
