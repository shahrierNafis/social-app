import { firestore } from "@/firebase";
import {
  DocumentData,
  DocumentReference,
  collection,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

type Comment = {
  text: string;
  imageUrl?: string;
  commenters: string[];
};

function Comments({ postRef }: { postRef: DocumentReference }) {
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    getDocs(collection(firestore, postRef.path, "comments")).then(
      (snapshot) => {
        setComments(
          snapshot.docs
            .map((doc) => doc.data() as Comment)
            .toSorted((a, b) => b.commenters.length - a.commenters.length)
        );
      }
    );
  }, [postRef]);

  return (
    <>
      <div className="m-2 p-2 border shadow flex flex-wrap">
        {comments.map((comment: DocumentData) => (
          <div key={comment.id}>
            <div className="border shadow inline-block m-1 p-1">
              <span className="relative border rounded-full min-w-[3em] px-4 max-w-xs shadow-sm inline-flex justify-center hover:cursor-pointer">
                <span className="line-clamp-3 break-all">{comment.text}</span>
              </span>
              <span className="">{comment.commenters.length}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Comments;
