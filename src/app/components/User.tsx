import { auth } from "@/firebase";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";

function User({ uid, href }: { uid: string; href?: string }) {
  const [user, loading, error] = useAuthState(auth);
  const [data, setData] = useState<User>();
  useEffect(() => {
    (async () => {
      if (!user) {
        return;
      }
      // Fetch user data with uid
      setData(
        await (
          await fetch(`/profile/api/${uid}/`, {
            // send the user info for user verification
            body: JSON.stringify({
              token: await user.getIdToken(),
              uid: user.uid,
            }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
        ).json()
      );
    })();
  }, [user, uid]);

  return (
    <>
      <Link href={href || `/room/${uid}`}>
        <div className="slider-card inline-flex flex-col items-center justify-center w-64 h-32 bg-gray-950 hover:bg-gray-700 rounded relative  mx-1 shadow cursor-pointer">
          <div
            className="slider-card-image w-12 h-12 rounded shadow	mx-auto"
            style={{
              backgroundImage: `url(${data?.photoURL})`,
              backgroundSize: "cover",
            }}
          ></div>
          <p className="slider-card-title break-words font-white font-bold ">
            {data?.displayName || "loading..."}
          </p>
        </div>
      </Link>
    </>
  );
}

export default User;
