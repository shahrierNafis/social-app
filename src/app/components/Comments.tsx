"use client";
import { firestore } from "@/firebase";
import {
  CollectionReference,
  DocumentReference,
  collection,
} from "firebase/firestore";
import React, { useRef } from "react";
import AddComment from "./AddComment";
import { Virtuoso } from "react-virtuoso";
import useComments from "../hooks/useComments";
import Comment from "./Comment";

function Comments({
  postRef,
  preOpened = false,
}: {
  postRef: DocumentReference;
  preOpened?: boolean;
}) {
  const commentsRef = useRef<CollectionReference>(
    collection(firestore, postRef.path, "comments")
  );
  const { comments, loadMore, loading, setVisibleRange, firstItemIndex } =
    useComments(commentsRef.current);
  return (
    <>
      {commentsRef && (
        <>
          <div className="sm:m-2 sm:p-2 border  shadow rounded bg-inherit">
            <h1>Comments</h1>
            <AddComment commentsRef={commentsRef.current} {...{ preOpened }} />
            {loading ? (
              <div className="mx-auto">Loading...</div>
            ) : (
              comments.length > 0 && (
                <>
                  <div className={`mx-auto w-full  border rounded shadow`}>
                    <Virtuoso
                      useWindowScroll
                      firstItemIndex={firstItemIndex}
                      increaseViewportBy={window.innerHeight * 5}
                      data={comments}
                      itemContent={(index, comment) => {
                        return <Comment key={comment.id} {...{ comment }} />;
                      }}
                      endReached={loadMore}
                      rangeChanged={setVisibleRange}
                    />
                  </div>
                </>
              )
            )}
          </div>
        </>
      )}
    </>
  );
}
export default Comments;
