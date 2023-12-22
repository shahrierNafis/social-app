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
import FlipMove from "react-flip-move";
import Reaction, { type ReactionTS } from "./Reaction";
import AddReaction from "./AddReaction";

function Reactions({ postRef }: { postRef: DocumentReference }) {
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
  return (
    <>
      {user && reactionsRef && (
        <div className="m-2 p-2 border shadow flex flex-wrap">
          <FlipMove>
            {reactions.map((reaction: ReactionTS, index) => (
              <div key={reaction.id} className="inline-block">
                <Reaction {...{ reaction, index, setReactions }} />
              </div>
            ))}
          </FlipMove>
          <AddReaction {...{ reactionsRef, user }} />
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
