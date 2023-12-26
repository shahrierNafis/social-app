import React from "react";
import { Virtuoso } from "react-virtuoso";
import usePosts from "../hooks/usePosts";
import Post from "./Post";

function Posts({ uid }: { uid: string }) {
  const { posts, loadMore, loading } = usePosts(uid);

  return (
    <>
      {loading ? (
        <div className="h-32 flex items-center justify-center">Loading...</div>
      ) : (
        <>
          <Virtuoso
            useWindowScroll
            increaseViewportBy={window.innerHeight * 5}
            data={posts}
            itemContent={(index, post) => {
              return <Post key={post.id} {...{ post }} />;
            }}
            endReached={loadMore}
          />
        </>
      )}
    </>
  );
}

export default Posts;
