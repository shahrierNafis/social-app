"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import OnlineUsers from "../components/OnlineUsers";

function Page() {
  const [user, loading, error] = useAuthState(auth);
  if (!loading && !user) {
    redirect("/sign-in");
  }

  return (
    <>
      {loading ? (
        "loading"
      ) : (
        <>
          <div className="text-3xl ">
            <Image
              className="rounded-full inline"
              src={user?.photoURL!}
              alt=""
              width={50}
              height={50}
            />
            {user?.displayName}{" "}
            <Link
              className="text-yellow-700 hover:text-yellow-600 text-xs"
              href="/profile/edit"
            >
              .edit
            </Link>
          </div>
          <Link
            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            href="/sign-out"
          >
            Sign Out
          </Link>
          <OnlineUsers></OnlineUsers>
        </>
      )}
    </>
  );
}

export default Page;
