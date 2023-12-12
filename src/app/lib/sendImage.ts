import { storage } from "@/firebase";
import { useMessageStore } from "@/useStore";
import { error } from "console";
import { User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function sendImage(
  image: File,
  user: User,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) {
  const room = useMessageStore.getState().room;
  if (!room) {
    return;
  }

  const storageRef = ref(storage, `/images/${room.id}/${uuidv4()}`);

  const uploadTask = uploadBytesResumable(storageRef, image);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Set task progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        addDoc(collection(room, "messages"), {
          type: "image",
          imageUrl: downloadURL,
          author: user.uid,
          timestamp: serverTimestamp(),
        });
      });
    }
  );
  return uploadTask;
}
