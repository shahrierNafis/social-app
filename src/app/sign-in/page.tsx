"use client";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import GoogleButton from "../components/GoogleButton";
import { redirect } from "next/navigation";
import AnonymousButton from "../components/AnonymousButton";
import { updateProfile } from "firebase/auth/cordova";

function Page() {
  const [user, loading, error] = useAuthState(auth);
  if (user) {
    if (user.isAnonymous) {
      updateProfile(user, {
        displayName: "Anonymous",
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/messaging-app-405702.appspot.com/o/photos%2FAnonymous%2Fphoto.webp?alt=media&token=b9b2cf99-f864-465d-a672-96cb43bd9111",
      }).then(() => location.replace("/profile/" + user.uid));
    } else {
      redirect("/profile/" + user.uid);
    }
  }
  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col">
        {loading ? (
          "loading"
        ) : (
          <>
            <GoogleButton />
            <AnonymousButton />
          </>
        )}
      </div>
    </>
  );
}

export default Page;
