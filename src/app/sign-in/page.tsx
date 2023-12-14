"use client";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import GoogleButton from "../components/GoogleButton";
import Link from "next/link";
import { redirect } from "next/navigation";

function Page() {
  const [user, loading, error] = useAuthState(auth);
  if (user) {
    redirect("/profile");
  }
  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {loading ? "loading" : <GoogleButton></GoogleButton>}
      </div>
    </>
  );
}

export default Page;
