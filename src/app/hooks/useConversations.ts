import { useState } from "react";
import { auth, firestore } from "@/firebase";
import {
  onSnapshot,
  collection,
  limit,
  orderBy,
  query,
  doc,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import getUser from "../lib/getUser";

type Conversation = {
  roomId: string;
  roomMate: User;
  latestMessage: QueryDocumentSnapshot | undefined;
};

function useConversations(): [Conversation[], boolean] {
  const [user] = useAuthState(auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) {
      return;
    }
    console.log(`users/${user?.uid}/conversations/`);

    const unsubscribe = onSnapshot(
      collection(firestore, `users/${user?.uid}/conversations`),
      async (snapshots) => {
        setLoading(false); // change loading state

        snapshots.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const newConversation = {
              roomId: change.doc.data().roomId, // set roomId
              roomMate: await getUser(user, change.doc.id), // set RoomMate
              latestMessage: await getLatestMessage(change.doc.data().roomId), // set latestMessage
            } as Conversation;
            if (newConversation.latestMessage === undefined) return;

            setConversations((prev) => {
              console.log("newConversation", newConversation);

              // add newConversation
              return [...prev, newConversation].sort((a, b) => {
                // sort conversations by latestMessage timestamp
                return (
                  b.latestMessage?.data().timestamp -
                  a.latestMessage?.data().timestamp
                );
              });
            });
          }
        });
      }
    );
    return () => {
      unsubscribe();
    };
  }, [user]);

  async function getLatestMessage(roomId: string) {
    return (
      await getDocs(
        query(
          collection(doc(firestore, `rooms/${roomId}`), "messages"),
          orderBy("timestamp", "desc"),
          limit(1)
        )
      )
    ).docs[0];
  }

  return [conversations, loading];
}

export default useConversations;
