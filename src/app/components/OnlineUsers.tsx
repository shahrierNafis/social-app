import { auth, database } from "@/firebase";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import User from "./User";
import { useAuthState } from "react-firebase-hooks/auth";
import CardSlider from "./CardSlider";
function OnlineUsers() {
  const [users, setUsers] = useState<string[]>();
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    const userConnectedRef = ref(database, `connections`);
    onValue(userConnectedRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      setUsers(Object.keys(snapshot.val()));
    });
  }, []);
  return (
    <>
      <CardSlider title="Online Users" titleClass="text-green-300 text-2xl">
        {users?.map((uid) => {
          if (uid === user?.uid) {
            return;
          }
          return <User key={uid} uid={uid} />;
        })}
      </CardSlider>
    </>
  );
}

export default OnlineUsers;
