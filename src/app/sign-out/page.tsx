"use client";
import { auth, database } from "@/firebase";
import { ref, set } from "firebase/database";
import { redirect } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

function Page() {
  const [user, loading, error] = useAuthState(auth);
  if (error) {
    redirect("/sign-in");
  }
  if (user) {
    const userConnectedRef = ref(database, `connections/${user.uid}`);
    set(userConnectedRef, false);
    auth.signOut();
  }

  return <div></div>;
}

export default Page;
