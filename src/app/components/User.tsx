import { auth } from "@/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import getUser, { User } from "@/app/lib/getUser";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

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
      {" "}
      <Link href={href || `/room/${uid}`}>
        <Card className="h-32 flex justify-center items-center">
          <CardContent className="p-0">
            <div className=" relative w-12 h-12 rounded shadow m-auto">
              <Image src={data?.photoURL || ""} alt="" fill />
            </div>
            <p className="break-words font-white font-bold ">
              {data?.displayName || "loading..."}
            </p>
          </CardContent>
        </Card>
      </Link>
    </>
  );
}

export default User;
