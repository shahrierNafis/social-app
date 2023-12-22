import { auth, firestore } from "@/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
export type ReactionTS = {
  id: string;
  emoji: string;
  reactors: string[];
  path: string;
};
export default function Reaction({
  reaction,
  index,
  setReactions,
}: {
  reaction: ReactionTS;
  index: number;
  setReactions: React.Dispatch<React.SetStateAction<ReactionTS[]>>;
}) {
  const [user, loading, error] = useAuthState(auth);
  async function onclick(reaction: ReactionTS, index: number) {
    if (userDidReact(reaction, user?.uid!)) {
      reaction.reactors.splice(reaction.reactors.indexOf(user?.uid!), 1); // remove
      updateDoc(doc(firestore, reaction.path), {
        reactors: arrayRemove(user?.uid!),
      });
    } else {
      reaction.reactors.push(user?.uid!); // add
      updateDoc(doc(firestore, reaction.path), {
        reactors: arrayUnion(user?.uid!),
      });
    }

    setReactions((reactions) => {
      reactions[index] = reaction;
      return [...sortReactions(reactions)]; // reSort reaction
    });
  }
  return (
    <>
      <div
        className={`border rounded shadow inline-block m-1 p-1 ${
          userDidReact(reaction, user?.uid!) && "bg-violet-700"
        }`}
      >
        <button
          className="border rounded-full px-1 hover:cursor-pointer bg-dark ring-black/50 lg:hover:ring active:ring"
          onClick={() => onclick(reaction, index)}
        >
          {reaction.emoji}
        </button>
        <span className=""> {reaction.reactors.length}</span>
      </div>
    </>
  );
}

function userDidReact(reaction: ReactionTS, user: string) {
  return reaction.reactors.includes(user);
}
function sortReactions(reactions: ReactionTS[]) {
  return reactions.toSorted((a, b) => b.reactors.length - a.reactors.length);
}
