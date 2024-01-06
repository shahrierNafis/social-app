import { auth, firestore } from "@/firebase";
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function FollowBtn({ uid }: { uid: string }) {
  const [user, loading, error] = useAuthState(auth);
  const [urFollowing, setUrFollowing] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const [isFollowingU, setIsFollowingU] = useState(false);
  const [loading3, setLoading3] = useState(true);

  useEffect(() => {
    return onSnapshot(
      doc(firestore, `users/${user?.uid}/following/${uid}`),
      (snapshot) => {
        if (snapshot.exists()) {
          setUrFollowing(true);
        } else {
          setUrFollowing(false);
        }
        setLoading2(false);
      }
    );
  }, [uid, user?.uid]);

  useEffect(() => {
    return onSnapshot(
      doc(firestore, `users/${uid}/following/${user?.uid}`),
      (snapshot) => {
        if (snapshot.exists()) {
          setIsFollowingU(true);
        } else {
          setIsFollowingU(false);
        }
        setLoading3(false);
      }
    );
  }, [uid, user?.uid]);

  function follow() {
    setDoc(doc(firestore, `users/${user?.uid}/following/${uid}`), {
      following: true,
    }).then(() => {
      setUrFollowing(true);
    });
  }
  function unFollow() {
    deleteDoc(doc(firestore, `users/${user?.uid}/following/${uid}`)).then(
      () => {
        setUrFollowing(false);
      }
    );
  }
  return (
    <>
      {loading || loading2 || loading3 ? (
        <>
          <Button disabled type="button">
            {" "}
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </>
      ) : urFollowing ? (
        <>
          <Button variant="outline" type="button" onClick={unFollow}>
            following
          </Button>
        </>
      ) : (
        <>
          <Button type="button" onClick={follow}>
            {isFollowingU ? "follow back" : "follow"}
          </Button>
        </>
      )}
    </>
  );
}

export default FollowBtn;
