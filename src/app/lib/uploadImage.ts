import { storage } from "@/firebase";
import {
  UploadTask,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function sendImage({
  image,
  setProgress,
  setImageUrl,
}: {
  image: File;
  setProgress?: React.Dispatch<React.SetStateAction<number>>;
  setImageUrl?: React.Dispatch<React.SetStateAction<string | undefined>>;
}): UploadTask {
  const storageRef = ref(storage, `/images/${uuidv4()}`);

  const uploadTask = uploadBytesResumable(storageRef, image);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Set task progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress && setProgress(progress);
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(setImageUrl);
    }
  );
  return uploadTask;
}
