import { useMessageStore } from "@/useStore";
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
  getDocs,
  QueryDocumentSnapshot,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useMessages() {
  const [room] = useMessageStore((state) => [state.room]);
  const [messages, setMessages] = useState<QueryDocumentSnapshot[]>([]);
  const [firstItemIndex, setFirstItemIndex] = useState<number>();
  const wasPrepended = useRef(false);

  // handle initial and new messages
  useEffect(() => {
    if (!room) {
      return;
    }
    const unsubscribe = onSnapshot(
      query(
        collection(room, "messages"),
        orderBy("timestamp", "desc"),
        limit(10)
      ),
      (snapshot) => {
        snapshot
          .docChanges()
          .toReversed()
          .forEach((change) => {
            if (change.type === "added") {
              setMessages((messages) => {
                return [...messages, change.doc];
              });
            }
          });
      }
    );

    return unsubscribe;
  }, [room]);

  // Change empty state
  useEffect(() => {
    if (room) {
      getCountFromServer(collection(room, "messages")).then((snapshot) => {
        setFirstItemIndex(snapshot.data().count);
      });
    }
    return () => {};
  }, [room]);

  // prepend older messages
  const prependMessage = useCallback(() => {
    // console.log("startReached");

    if (room && messages[0] && firstItemIndex) {
      getDocs(
        query(
          collection(room, "messages"),
          orderBy("timestamp", "desc"),
          startAfter(messages[0]),
          limit(10)
        )
      ).then((olderMessages) => {
        console.log("queried older messages");
        if (olderMessages.docs.length > 0) {
          // console.log("prepending messages");

          setMessages((messages) => {
            // if messages ware already present
            if (olderMessages.docs.toReversed()[0].id === messages[0].id) {
              console.log("messages ware already present");
              return messages;
            } else {
              setFirstItemIndex(firstItemIndex - olderMessages.docs.length);
              wasPrepended.current = true;
              return [...olderMessages.docs.toReversed(), ...messages];
            }
          });
        }
      });
    }
  }, [room, messages, firstItemIndex]);
  return { messages, prependMessage, firstItemIndex, wasPrepended };
}
