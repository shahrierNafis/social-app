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
      <div className="flex p-2 items-center space-x-2 bg-zinc-900 flex-shrink-0 overflow-x-scroll no-scrollbar">
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
            <Link className="ml-auto text-white font-bold" href={roomNameLink}>
              <div className="  flex items-center flex-row">
                <div className="flex relative items-center justify-center h-8 w-8 rounded-full  flex-shrink-0">
                  <Image
                    className="rounded-full h-full w-full bg-zinc-600"
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
          <div className="flex items-center justify-center vh-100 vw-100 fixed top-0 left-0 z-50 bg-zinc-600 bg-opacity-95 text-white font-bold">
            Loading...
          </div>
        </>
      )}
    </>
  );
}

export default NavigationBar;
