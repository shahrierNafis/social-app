"use client";
import { auth, database } from "@/firebase";
import { ref, remove, set } from "firebase/database";
import { redirect } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";

function Page() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  function signOut() {
    const userConnectedRef = ref(database, `connections/${user?.uid}`);
    remove(userConnectedRef); //set offline
    auth.signOut();
    redirect("/sign-in");
  }
  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 bg-black w-64 p-4 rounded-lg 32">
        <div className="text-2xl ">Are you sure you want to sign out?</div>
        <div className="flex justify-between w-[100%]">
          <Button className="bg-gray-500" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button className="bg-red-500" onClick={signOut}>
            Yes!
          </Button>
        </div>
      </div>
    </>
  );
}

export default Page;
