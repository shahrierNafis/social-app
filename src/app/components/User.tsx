import { auth } from "@/firebase";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function User({ uid }: { uid: string }) {
  const [user, loading, error] = useAuthState(auth);
  const [data, setData] = useState<User>();
  useEffect(() => {
    (async () => {
      if (!user) {
        return;
      }
      const res = await (
        await fetch(`/profile/api/${uid}/`, {
          body: JSON.stringify({ user }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
      ).json();

      setData(res.user);
    })();
  }, [user, uid]);

  return (
    <>
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
    </>
  );
}

export default User;
