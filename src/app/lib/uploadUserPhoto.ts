import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default async function uploadUserPhoto(imgBlob: Blob, uid: string) {
  const storageRef = ref(storage, `photos/${uid}/photo.webp`);
  await uploadBytes(storageRef, imgBlob);
  return await getDownloadURL(storageRef);
}
