import { auth } from "@/firebase";
import {
  CollectionReference,
  addDoc,
  arrayUnion,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CommentData } from "../hooks/useComments";
import { useAuthState } from "react-firebase-hooks/auth";
import useResizeTextArea from "../hooks/useResizeTextArea";
import { Textarea } from "@/components/ui/textarea";
function AddComment({
  commentsRef,
  preOpened = false,
}: {
  commentsRef: CollectionReference;
  preOpened: boolean;
}) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(preOpened);
  const [user, loading, error] = useAuthState(auth);
  const [isSending, setIsSending] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  useResizeTextArea(textarea.current, text);

  useEffect(() => {
    if (isSending && commentsRef && commentsRef.parent && user) {
      // add comment
      addDoc(commentsRef, {
        text,
        timestamp: serverTimestamp(),
        author: user.uid,
        innerCommentsIDs: [] as string[],
      } as CommentData)
        // add innerCommentsIDs to parent
        .then((DocumentReference) => {
          updateDoc(commentsRef.parent!, {
            innerCommentsIDs: arrayUnion(DocumentReference.id),
          });
        })
        .then(() => {
          setText("");
          setIsSending(false);
          setOpen(false);
        });
    }
  }, [commentsRef, user, text, isSending]);

  return (
    <>
      {open ? (
        <form>
          <Textarea
            ref={textarea}
            className="overflow-hidden m-2"
            rows={1}
            placeholder="Leave a comment here"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && setIsSending(true)}
          />
          <Button
            onClick={() => setIsSending(true)}
            disabled={isSending}
            className="m-1"
          >
            Comment
          </Button>
          <Button
            className="m-1"
            variant="destructive"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <>
          <Button className="m-1" onClick={() => setOpen(true)}>
            ➕Add comment
          </Button>
        </>
      )}
    </>
  );
}

export default AddComment;
