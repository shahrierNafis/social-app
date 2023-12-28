import { auth, firestore } from "@/firebase";
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

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
          <button
            type="button"
            className=" m-2 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900  bg-white rounded-lg border border-gray-200  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 "
          >
            Loading...
          </button>
        </>
      ) : urFollowing ? (
        <>
          <button
            type="button"
            className=" m-2 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={unFollow}
          >
            following
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className=" m-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={follow}
          >
            {isFollowingU ? "follow back" : "follow"}
          </button>
        </>
      )}
    </>
  );
}

export default FollowBtn;
