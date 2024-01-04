import User from "./User";
import CardSlider from "./CardSlider";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import listAllUsers from "../lib/listAllUsers";
import searchUsers from "../lib/searchUsers";
function SearchUsers() {
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const [quarry, setQuarry] = useState("");
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  function onclick() {
    // show all user if quarry is empty
    if (quarry.trim() === "") {
      setLoading(true);
      listAllUsers()
        .then((result) => {
          setSearchResult(result);
        })
        .then(() => {
          setLoading(false);
        });

      return;
    }

    setLoading(true);
    searchUsers(quarry)
      .then((result) => {
        setSearchResult(result);
      })
      .then(() => {
        setLoading(false);
      });
  }

  // show all users on first render
  useEffect(() => {
    setLoading(true);
    listAllUsers()
      .then((result) => {
        setSearchResult(result);
      })
      .then(() => {
        setLoading(false);
      });

    return () => {};
  }, []);

  const title = (
    <>
      <div className="relative m-1">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <div className="flex items-center">
          <input
            type="search"
            id="default-search"
            className="inline md:max-w-[45vw] w-full py-2 ps-10 text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="..."
            value={quarry}
            onChange={(e) => setQuarry(e.target.value)}
            required
          />
          <button
            type="button"
            className="text-white m-1 inline end-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
            onClick={onclick}
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
  return (
    <>
      <CardSlider {...{ title }}>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <span className="text-gray-400">{"Loading..."}</span>
          </div>
        ) : searchResult?.length === 0 ? (
          <div className="h-32 flex items-center justify-center">
            <span className="text-gray-400">{"No Search Result"}</span>
          </div>
        ) : (
          user &&
          searchResult?.map((uid) => {
            if (uid !== user.uid) {
              return <User key={uid} uid={uid} href={`/profile/${uid}`} />;
            }
          })
        )}
      </CardSlider>
    </>
  );
}

export default SearchUsers;
