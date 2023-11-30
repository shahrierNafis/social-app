import { useMessageStore } from "@/useStore";
import {
  QueryDocumentSnapshot,
  collection,
  onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

function MessageList() {
  const [room] = useMessageStore((state) => [state.room]);
  const [messages, setMessages] = useState<QueryDocumentSnapshot[] | null>(
    null
  );
  useEffect(() => {
    if (!room) {
      return;
    }
    const unsubscribe = onSnapshot(collection(room, "messages"), (snapshot) => {
      setMessages(snapshot.docs);
    });
    return unsubscribe;
  }, [room]);
  return (
    <>
      {messages ? (
        messages.length > 0 ? (
          messages.map((doc) => {
            return <div key={doc.id}>{doc.data().text}</div>;
          })
        ) : (
          <div>No messages</div>
        )
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default MessageList;
