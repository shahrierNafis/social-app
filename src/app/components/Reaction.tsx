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
function Reaction({
  reaction,
  index,
  setReactions,
  size = "base",
}: {
  reaction: ReactionTS;
  index: number;
  setReactions: React.Dispatch<React.SetStateAction<ReactionTS[]>>;
  size?: string;
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
        className={`text-${size} border rounded shadow inline-block m-1 p-1 ${
          userDidReact(reaction, user?.uid!) && "bg-violet-700"
        }`}
      >
        <button
          className={`!text-${size} border rounded-full px-1 hover:cursor-pointer bg-zinc-950 ring-black/50 lg:hover:ring active:ring`}
          onClick={() => onclick(reaction, index)}
        >
          {reaction.emoji}
        </button>
        <span className={`text-${size}`}> {reaction.reactors.length}</span>
      </div>
    </>
  );
}

export default Reaction;
function userDidReact(reaction: ReactionTS, user: string) {
  return reaction.reactors.includes(user);
}
function sortReactions(reactions: ReactionTS[]) {
  return reactions.toSorted((a, b) => b.reactors.length - a.reactors.length);
}
