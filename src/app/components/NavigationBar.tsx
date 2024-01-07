"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import Link from "next/link";
import { BiMessage } from "react-icons/bi";
import { useRoomStore } from "@/useStore";
import { usePathname } from "next/navigation";
import Image from "next/image";
function NavigationBar() {
  const [user, loading, error] = useAuthState(auth);
  const [roomName] = useRoomStore((state) => [state.roomName]);
  const [roomNameLink] = useRoomStore((state) => [state.roomNameLink]);
  const [roomImage] = useRoomStore((state) => [state.roomImage]);
  const isInARoom = usePathname().includes("/room/");
  const isInConversations = usePathname() == "/conversations";
  const isInUsers = usePathname() == "/users";
  const isAtHome = usePathname() == "/";
  const isinAProfile = usePathname().includes("/profile/");
  const isInSubmit = usePathname() == "/submit";
  return (
    <>
      <div className="flex items-center flex-shrink-0 p-2 space-x-2 overflow-x-scroll bg-zinc-900 no-scrollbar">
        <BiMessage className="hidden sm:inline-block" size={32} />

        <div className="me-auto">
          <Link
            className={`hover:ring hover:ring-white hover:ring-opacity-20 ring-opacity-20 p-1 rounded  mx-2 ${
              isAtHome && "ring rounded p-1 text-blue-500"
            }`}
            href="/"
          >
            Home
          </Link>
          {loading ? (
            <Link href="#loading">loading</Link>
          ) : user ? (
            <>
              <Link
                className={`hover:ring hover:ring-white hover:ring-opacity-20 ring-opacity-20 p-1 rounded mx-2 ${
                  isInConversations && "ring rounded p-1 text-blue-500"
                }`}
                href="/conversations"
              >
                Conversations
              </Link>
              <Link
                className={`hover:ring hover:ring-white hover:ring-opacity-20 ring-opacity-20 p-1 rounded  mx-2 ${
                  isInUsers && "ring rounded p-1 text-blue-500"
                }`}
                href="/users"
              >
                Users
              </Link>
              <Link
                className={`hover:ring  ring-opacity-20 hover:ring-white hover:ring-opacity-20 p-1 rounded  mx-2 ${
                  isinAProfile && "ring rounded p-1 text-blue-500"
                }`}
                href={`/profile/${user.uid}`}
              >
                Profile
              </Link>
              <Link
                className={`hover:ring hover:ring-white hover:ring-opacity-20 ring-opacity-20 p-1 rounded  mx-2 ${
                  isInSubmit && "ring rounded p-1 text-blue-500"
                }`}
                href="/submit"
              >
                ➕Create
              </Link>
            </>
          ) : (
            <Link
              className={`mx-2 ${isAtHome && "ring rounded p-1 text-blue-500"}`}
              href="/sign-in"
            >
              Sign in
            </Link>
          )}
        </div>
        {/* room info */}
        <div className="">
          {user && isInARoom && (
            <Link className="ml-auto font-bold text-white" href={roomNameLink}>
              <div className="flex flex-row items-center ">
                <div className="relative flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full">
                  <Image
                    className="w-full h-full rounded-full bg-zinc-600"
                    src={roomImage || ""}
                    alt=""
                    fill
                  />
                </div>
                {roomName}
              </div>
            </Link>
          )}
        </div>
      </div>
      {loading && (
        <>
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen font-bold text-white bg-zinc-900 bg-opacity-95">
            Loading...
          </div>
        </>
      )}
    </>
  );
}

export default NavigationBar;
