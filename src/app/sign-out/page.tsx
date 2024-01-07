"use client";
import { auth, database } from "@/firebase";
import { ref, remove, set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function Page() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  function signOut() {
    if (user) {
      const userConnectedRef = ref(database, `connections/${user.uid}`);
      remove(userConnectedRef); //set offline

      //delete anonymous user on sign out
      if (user.isAnonymous) {
        user.delete();
      }

      auth.signOut();
      router.push("/sign-in");
    }
  }
  return (
    <>
      <div className="absolute w-64 p-4 -translate-x-1/2 -translate-y-1/2 bg-black border-2 rounded-lg top-1/2 left-1/2 32">
        <div className="text-2xl ">Are you sure you want to sign out?</div>
        <div className="flex justify-between w-[100%]">
          <Button
            variant={"outline"}
            className="bg-zinc-900"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button variant={"destructive"} onClick={signOut}>
            Yes!
          </Button>
        </div>
      </div>
    </>
  );
}

export default Page;
