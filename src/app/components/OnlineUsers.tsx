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
      // filter out the current user
      const uIDs = Object.keys(snapshot.val()).filter(
        (uid) => uid !== user?.uid
      );
      setUsers(uIDs);
    });
  }, [user]);
  return (
    <>
      <CardSlider title="Online Users" titleClass="text-green-300 text-2xl">
        {users?.length === 0 ? (
          <div className="h-32 flex items-center justify-center">
            <span className="text-gray-400">{"No users online!"}</span>
          </div>
        ) : (
          users?.map((uid) => {
            return <User key={uid} uid={uid} />;
          })
        )}
      </CardSlider>
    </>
  );
}

export default OnlineUsers;
