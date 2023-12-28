import React, { useEffect, useState } from "react";
import { Comment as CommentType } from "../hooks/useComments";
import Comments from "./Comments";
import Reactions from "./Reactions";
import Image from "next/image";
import getUser, { User } from "@/app/lib/getUser";
import { Button } from "react-bootstrap";
import { auth } from "@/firebase";
import Link from "next/link";
import { memo } from "react";
import { motion } from "framer-motion";

const Comment = memo(function Comment({ comment }: { comment: CommentType }) {
  const [author, setAuthor] = useState<User>();
  const [isExpanded, setIsExpanded] = useState(false);

  // setAuthor
  useEffect(() => {
    if (comment.data().author) {
      getUser(comment.data().author!).then(setAuthor);
    }
  }, [comment]);

  const hasInnerComments = comment.data().innerCommentsIDs.length > 0;

  return (
    <>
      <motion.div key={comment.id} animate={{ scale: [1, 1.05, 1], x: 0 }}>
        <div className="p-2">
          <div
            className={`p-2 border shadow rounded ${
              isExpanded ? "bg-neutral-900" : "bg-dark"
            }`}
            key={comment.id}
          >
            {/* photo, name and timestamp */}
            {author ? (
              <>
                <Link href={`/profile/${author.uid}`}>
                  {author?.photoURL && (
                    <Image
                      className="rounded-full inline bg-zinc-900"
                      src={author?.photoURL}
                      alt=""
                      width={50}
                      height={50}
                    />
                  )}
                  {author?.displayName}
                </Link>
                {comment.data().timestamp && (
                  <span className="text-gray-400 text-xs">
                    {" "}
                    {comment.data().timestamp.toDate().toDateString()}
                  </span>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <div className="rounded-full inline-block bg-zinc-900 w-[50px] h-[50px]"></div>{" "}
                  loading...
                </div>
              </>
            )}
            {/* comment body */}
            <div className="shadow sm:m-1 my-1 sm:p-1 sm:px-4 break-words">
              {comment.data().text}
            </div>

            <div className="flex items-center">
              {/* Reactions, comment button, remove button */}
              <Reactions postRef={comment.ref} size="xs" />
              <Button
                className={`${hasInnerComments && "bg-blue-500"} text-xs mx-1`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                comment
              </Button>{" "}
              {comment.data().author === auth.currentUser?.uid && (
                <Button
                  className="text-xs float-right mx-1"
                  variant="danger"
                  onClick={() => comment.remove()}
                >
                  remove comment
                </Button>
              )}
            </div>
            {/* comments */}
            {isExpanded && (
              <Comments postRef={comment.ref} preOpened={!hasInnerComments} />
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}, arePropsEqual);
export default Comment;
function arePropsEqual(
  oldProps: { comment: CommentType },
  newProps: { comment: CommentType }
) {
  return (
    oldProps.comment.id === newProps.comment.id &&
    oldProps.comment.data().innerCommentsIDs.length ===
      newProps.comment.data().innerCommentsIDs.length
  );
}
