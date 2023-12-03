import { firestore } from "@/firebase";
import { useMessageStore } from "@/useStore";
import {
  QueryDocumentSnapshot,
  collection,
  onSnapshot,
  query,
  limit,
  orderBy,
  startAt,
  getDocs,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

function MessageList() {
  const [room] = useMessageStore((state) => [state.room]);
  const [messages, setMessages] = useState<QueryDocumentSnapshot[]>([]);
  const [empty, setEmpty] = useState(false);
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
        setEmpty(false);
        snapshot
          .docChanges()
          .reverse()
          .forEach((change) => {
            console.log(change.doc);

            if (change.type === "added") {
              setMessages((messages) => {
                if (messages) {
                  return [...messages, change.doc];
                } else {
                  return [change.doc];
                }
              });
            }
          });
      }
    );

    // check if there are any messages in the room
    getDocs(query(collection(room, "messages"), limit(1))).then((snapshot) => {
      if (snapshot.empty) {
        setEmpty(true);
      }
    });

    return unsubscribe;
  }, [room]);
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <>
      {empty ? (
        <div>No messages</div>
      ) : messages.length > 0 ? (
        messages.map((doc) => {
          return <div key={doc.id}>{doc.data().text}</div>;
        })
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default MessageList;
