import { auth, firestore } from "@/firebase";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  collection,
  onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Reaction, { type ReactionTS } from "./Reaction";
import AddReaction from "./AddReaction";
import { motion } from "framer-motion";

function Reactions({
  postRef,
  size = "base",
}: {
  postRef: DocumentReference;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
}) {
  const [reactions, setReactions] = useState<ReactionTS[]>([]);
  const [user, loading, error] = useAuthState(auth);

  const [reactionsRef, setReactionsRef] =
    useState<CollectionReference<DocumentData, DocumentData>>();

  useEffect(() => {
    const reactionsRef = collection(firestore, postRef.path, "reactions");
    setReactionsRef(reactionsRef);

    // get reactions
    const unsubscribe = onSnapshot(reactionsRef, (snapshot) => {
      setReactions(
        sortReactions(
          snapshot.docs.map((doc) => {
            return {
              emoji: doc.id,
              reactors: doc.data().reactors,
              id: doc.id,
              path: doc.ref.path,
            } as ReactionTS;
          })
        )
      );
    });
    return () => unsubscribe();
  }, [postRef]);

  const transition = {
    type: "spring",
    stiffness: 420,
    damping: 25,
  };

  return (
    <>
      {user && reactionsRef && (
        <div
          className={`${
            !["sm", "xs"].includes(size) && "m-2 p-2"
          } shadow inline-flex flex-wrap items-center w-100%`}
        >
          {reactions.map((reaction: ReactionTS, index) => (
            <motion.div
              layout
              transition={transition}
              animate={{ scale: [1, 2, 1] }}
              key={reaction.id}
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.1 },
              }}
              whileTap={{ scale: 0.9 }}
              className={`text-${size} inline-block`}
            >
              <Reaction {...{ reaction, index, setReactions, size }} />
            </motion.div>
          ))}
          <AddReaction {...{ reactionsRef, user, size }} />
        </div>
      )}
    </>
  );
}

export default Reactions;
/**
 * Sorts an array of ReactionTS objects in descending order based on the number of reactors.
 *
 * @param reactions - The array of ReactionTS objects to be sorted.
 * @returns The sorted array of ReactionTS objects.
 */
function sortReactions(reactions: ReactionTS[]) {
  return reactions.sort((a, b) => b.reactors.length - a.reactors.length);
}
