import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import uploadImage from "@/app/lib/uploadImage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { UploadTask } from "firebase/storage";
import { useRoomStore } from "@/useStore";
import imageCompression from "browser-image-compression";
import { Loader2 } from "lucide-react";

function AttachImgBtn() {
  const [image, setImage] = useState<File>();
  const [isVisible, setIsVisible] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [progress, setProgress] = useState(0);
  const [uploadTask, setUploadTask] = useState<UploadTask>();
  const [isSending, setIsSending] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [room] = useRoomStore((state) => [state.room]);

  async function onClick() {
    if (!isVisible || !image || !user) {
      return;
    }
    // Start upLoading
    setUploadTask(
      uploadImage({
        image: await imageCompression(image, { maxSizeMB: 5 }), // 5MB
        setProgress,
        setImageUrl,
      })
    );
    setIsSending(true);
  }

  // send image when upload task is done
  useEffect(() => {
    if (imageUrl && user && room) {
      addDoc(collection(room, "messages"), {
        type: "image",
        imageUrl: imageUrl,
        author: user.uid,
        timestamp: serverTimestamp(),
      });
    }
  }, [imageUrl, room, user]);

  function cancel() {
    if (uploadTask) {
      uploadTask.cancel();
      setUploadTask(undefined);
    }
    setIsVisible(false);
    setProgress(0);
    setIsSending(false);
  }

  // hide on 100%
  useEffect(() => {
    if (progress === 100 && imageUrl) {
      setIsVisible(false);
      setProgress(0);
      setUploadTask(undefined);
      setIsSending(false);
    }

    return () => {};
  }, [progress, imageUrl]);

  return (
    <>
      <label
        htmlFor="attach-img"
        className="relative flex items-center justify-center text-gray-300 hover:text-white h-full basis-6"
      >
        {
          <input
            onChange={(e) => {
              e.target.files && setImage(e.target.files[0]);
            }}
            onClick={() => setIsVisible(true)}
            accept="image/*"
            type="file"
            className="hidden"
            name="attach-img"
            id="attach-img"
          />
        }
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          fill="currentColor"
          version="1.1"
          viewBox="0 0 489.4 489.4"
          xmlSpace="preserve"
        >
          <g>
            <g>
              <path d="M0,437.8c0,28.5,23.2,51.6,51.6,51.6h386.2c28.5,0,51.6-23.2,51.6-51.6V51.6c0-28.5-23.2-51.6-51.6-51.6H51.6    C23.1,0,0,23.2,0,51.6C0,51.6,0,437.8,0,437.8z M437.8,464.9H51.6c-14.9,0-27.1-12.2-27.1-27.1v-64.5l92.8-92.8l79.3,79.3    c4.8,4.8,12.5,4.8,17.3,0l143.2-143.2l107.8,107.8v113.4C464.9,452.7,452.7,464.9,437.8,464.9z M51.6,24.5h386.2    c14.9,0,27.1,12.2,27.1,27.1v238.1l-99.2-99.1c-4.8-4.8-12.5-4.8-17.3,0L205.2,333.8l-79.3-79.3c-4.8-4.8-12.5-4.8-17.3,0    l-84.1,84.1v-287C24.5,36.7,36.7,24.5,51.6,24.5z" />
              <path d="M151.7,196.1c34.4,0,62.3-28,62.3-62.3s-28-62.3-62.3-62.3s-62.3,28-62.3,62.3S117.3,196.1,151.7,196.1z M151.7,96    c20.9,0,37.8,17,37.8,37.8s-17,37.8-37.8,37.8s-37.8-17-37.8-37.8S130.8,96,151.7,96z" />
            </g>
          </g>
        </svg>
      </label>
      {isVisible && image && (
        <div className="absolute z-50 top-0 left-0 vh-100 vw-100 flex flex-col items-center justify-center backdrop-blur-sm	">
          <>
            {/*eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="object-contain max-w-[75vw] max-h-[75vh]"
              src={URL.createObjectURL(image)}
              alt="preview"
            />
            <div>
              {isSending ? (
                <>
                  <Progress className="w-full" value={progress} />
                  <Button
                    className="m-2"
                    variant="destructive"
                    onClick={() => cancel()}
                  >
                    Cancel
                  </Button>
                  <Button className="m-2" variant="secondary" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="m-2"
                    variant="destructive"
                    onClick={() => setIsVisible(false)}
                  >
                    Close
                  </Button>
                  <Button className="m-2" onClick={onClick}>
                    Send
                  </Button>
                </>
              )}
            </div>
          </>
        </div>
      )}
    </>
  );
}

export default AttachImgBtn;
