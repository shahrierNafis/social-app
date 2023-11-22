"use client";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import GoogleButton from "../components/GoogleButton";
import Link from "next/link";

function Page() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {loading ? (
          "loading"
        ) : user ? (
          <Link
            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            href="/sign-out"
          >
            Sign Out
          </Link>
        ) : (
          <GoogleButton></GoogleButton>
        )}
      </div>
    </>
  );
}

export default Page;
