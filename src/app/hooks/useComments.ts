import {
  onSnapshot,
  query,
  orderBy,
  limit,
  QueryDocumentSnapshot,
  CollectionReference,
  getDocs,
  startAfter,
  startAt,
  endAt,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

export type CommentData = {
  text: string;
  imageUrl?: string;
  timestamp: Timestamp;
  author?: string;
  innerCommentsIDs: string[];
};
export type Comment = QueryDocumentSnapshot<CommentData> & {
  remove: () => void;
};

export default function useComments(commentsRef: CollectionReference) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const quantity = 10;
  const [visibleRange, setVisibleRange] = useState({
    startIndex: 0,
    endIndex: 0,
  });

  // remove comment method
  function remove(this: Comment) {
    deleteDoc(this.ref).then(() => {
      setComments((comments) => {
        return comments.filter((comment) => comment.id !== this.id);
      });
    });
  }

  // new comments
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(commentsRef, orderBy("timestamp", "desc"), limit(quantity)),
      (snapshot) => {
        setLoading(false);
        snapshot
          .docChanges()
          .toReversed()
          .forEach((change) => {
            if (change.type === "added") {
              setComments((comments) => {
                return [
                  Object.assign(change.doc, { remove }) as Comment,
                  ...comments,
                ];
              });
            }
          });
      }
    );
    return unsubscribe;
  }, [commentsRef]);

  // load more old comments
  const loadMore = useCallback(
    (lastItemIndex: number) => {
      getDocs(
        query(
          commentsRef,

          orderBy("timestamp", "desc"),
          startAfter(comments[lastItemIndex].data().timestamp),
          limit(quantity)
        )
      ).then((snapshot) => {
        setLoading(false);
        if (snapshot.empty) {
          setHasMore(false);
        } else if (snapshot.docs[0].id !== comments[0].id) {
          setHasMore(true);
          snapshot.docs.forEach((doc) => {
            setComments((comments) => {
              return [...comments, Object.assign(doc, { remove }) as Comment];
            });
          });
        }
      });
    },
    [commentsRef, comments]
  );

  // sync comments in visible range
  useEffect(() => {
    if (comments.length <= visibleRange.endIndex) {
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        commentsRef,
        orderBy("timestamp", "desc"),
        startAt(comments[visibleRange.startIndex].data().timestamp),
        endAt(comments[visibleRange.endIndex].data().timestamp)
      ),
      (snapshots) => {
        snapshots.docChanges().forEach((change) => {
          // update modified comments
          if (change.type === "modified") {
            setComments((comments) => {
              comments[change.newIndex + visibleRange.startIndex] =
                Object.assign(change.doc, { remove }) as Comment;
              return [...comments];
            });
          }
          // filter out deleted comments
          else if (change.type === "removed") {
            setComments((comments) => {
              return comments.filter((comment) => comment.id !== change.doc.id);
            });
          }
        });
      }
    );

    return unsubscribe;
  }, [comments, commentsRef, visibleRange]);

  return { comments, loadMore, loading, hasMore, setVisibleRange };
}
