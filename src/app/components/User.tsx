import { auth } from "@/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import getUser, { User } from "@/app/lib/getUser";

function User({ uid, href }: { uid: string; href?: string }) {
  const [user, loading, error] = useAuthState(auth);
  const [data, setData] = useState<User>();
  useEffect(() => {
    (async () => {
      if (!user) {
        return;
      }
      // Fetch user data with uid
      setData(await getUser(uid));
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
