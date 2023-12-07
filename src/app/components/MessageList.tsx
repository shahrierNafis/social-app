import { useMessageStore } from "@/useStore";

import React, { useCallback, useEffect, useRef } from "react";
import Message from "./Message";
import useMessages from "../hooks/useMessage";
import { Virtuoso } from "react-virtuoso";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

function MessageList() {
  const { messages, prependMessage, firstItemIndex, wasPrepended } =
    useMessages();

  const [user, loading, error] = useAuthState(auth);

  const onFollowOutputHandler = useCallback(
    (atBottom: boolean) => {
      // if older messages were prepended, don't scroll
      if (wasPrepended.current) {
        wasPrepended.current = false;
        return false;
      }
      // if at the bottom or the user sent a message scroll to the bottom
      if (
        atBottom ||
        messages[messages.length - 1].data().author === user?.uid
      ) {
        return "smooth";
      } else {
        // if not at the bottom, don't scroll
        return false;
      }
    },
    [wasPrepended, messages, user?.uid]
  );
  const Header = useCallback(() => {
    return (
      <>
        {firstItemIndex! > 10 && (
          <div
            style={{
              padding: "1rem",
              textAlign: "center",
            }}
          >
            Loading...
          </div>
        )}
      </>
    );
  }, [firstItemIndex]);
  return (
    <>
      <div className="flex-auto">
        {firstItemIndex === 0 ? (
          <div>No messages</div>
        ) : firstItemIndex ? (
          <Virtuoso
            firstItemIndex={firstItemIndex}
            initialTopMostItemIndex={firstItemIndex}
            data={messages}
            startReached={prependMessage}
            followOutput={onFollowOutputHandler}
            itemContent={(index, message) => {
              let previousMessage = messages[index - firstItemIndex - 1];
              let sameAuthor = previousMessage
                ? previousMessage.data().author == message.data().author
                : false;
              return <Message message={message} sameAuthor={sameAuthor} />;
            }}
            components={{ Header }}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}

export default MessageList;
