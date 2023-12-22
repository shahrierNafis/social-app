"use client";

import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import useConversations from "./hooks/useConversations";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/app/lib/getUser";
export default function Home() {
  const [conversations, loading] = useConversations();

  return (
    <>
      <h1 className="text-white text-3xl border-b">Conversations</h1>
      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <span className="text-gray-400">{"Loading..."}</span>
        </div>
      ) : conversations.length ? (
        <>
          {conversations.map((conversation) => {
            return (
              <>
                <Link
                  className="nav-link text-whit shadow rounded m-1 "
                  href={"/room/" + conversation.roomId}
                  key={conversation.roomId}
                >
                  <div className="  flex items-center flex-row ">
                    <div className="relative h-12 w-12 mr-4">
                      <Image
                        className="rounded-full h-full w-full bg-gray-600"
                        src={conversation.roomMate.photoURL || ""}
                        alt=""
                        fill
                      />
                    </div>
                    <div>
                      <div className="text-2xl">
                        {conversation.roomMate.displayName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {conversation.latestMessage &&
                          messageTypeSwitch(
                            conversation.roomMate,
                            conversation.latestMessage
                          )}
                      </div>
                    </div>
                  </div>
                </Link>
              </>
            );
          })}
        </>
      ) : (
        <div className="h-32 flex items-center justify-center">
          <span className="text-gray-400">{"No conversations!"}</span>
        </div>
      )}
    </>
  );
  function messageTypeSwitch(roomMate: User, message: QueryDocumentSnapshot) {
    const duration = " · " + timestampToDuration(message.data().timestamp);
    switch (message.data().type) {
      case "text":
        if (message.data().author == roomMate.uid) {
          return <>{message.data().text + duration}</>;
        } else {
          return <>you: {message.data().text + duration}</>;
        }
      case "image":
        if (message.data().author == roomMate.uid) {
          return <>{"sent an image" + duration}</>;
        } else {
          return <>{"you: sent an image" + duration}</>;
        }
      default:
        return "ERROR: Unknown message type!";
    }
  }
}
function timestampToDuration(timestamp: Timestamp) {
  const millisecondsDiff = Date.now() - timestamp.toDate().getTime();
  let duration = "";
  let shortestDuration = Infinity;
  Object.entries({
    s: millisecondsDiff / 1000,
    m: millisecondsDiff / (60 * 1000),
    h: millisecondsDiff / (60 * 1000 * 60),
    d: millisecondsDiff / (60 * 1000 * 60 * 24),
    w: millisecondsDiff / (60 * 1000 * 60 * 24 * 7),
    y: millisecondsDiff / (60 * 1000 * 60 * 24 * 365),
  }).forEach(([key, value]) => {
    if (value >= 1 && value < shortestDuration) {
      duration = `${Math.floor(value)}${key} `;
    }
  });
  return duration;
}
