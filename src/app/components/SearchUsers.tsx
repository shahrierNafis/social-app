import User from "./User";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import listAllUsers from "../lib/listAllUsers";
import searchUsers from "../lib/searchUsers";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  return (
    <>
      <div className="p-2 lg:p-4 mt-4 border-x md:m-2">
        <div className="flex items-center mb-2">
          <Input
            type="text"
            className="px-3 py-2 max-w-xl bg-zinc-900"
            placeholder="Search..."
            value={quarry}
            onChange={(e) => setQuarry(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onclick();
              }
            }}
          />
          <Button onClick={onclick} className="px-3 py-2">
            Search
          </Button>
        </div>
        <Carousel
          opts={{
            dragFree: true,
            align: "start",
          }}
          className="border-y flex max-w-[100vw] justify-center items-center shadow rounded"
        >
          <CarouselPrevious className="left-0 shrink-0 z-50" />
          <CarouselContent className="">
            {loading ? (
              <div className="w-full h-32 flex items-center justify-center">
                Loading...
              </div>
            ) : (
              searchResult.map((uid) => (
                <CarouselItem key={uid} className="basis-[16rem]">
                  <div className="p-1">
                    <User uid={uid} href={`/profile/${uid}`} />
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselNext className="z-50 right-0 shrink-0" />
        </Carousel>
      </div>
    </>
  );
}

export default SearchUsers;
