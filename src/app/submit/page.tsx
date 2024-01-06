"use client";
import { auth, firestore } from "@/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import uploadImage from "../lib/uploadImage";
import imageCompression from "browser-image-compression";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import PostData from "../types/PostData";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Page() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  async function onSubmit() {
    setIsSending(true);
    if (image) {
      uploadImage({
        image: await imageCompression(image, { maxSizeMB: 5 }), // 5MB
        setProgress,
        setImageUrl,
      });
    }
  }
  useEffect(() => {
    if (user && isSending) {
      // if image is loaded but url is not ready, skip
      if (image ? imageUrl : text) {
        // add post
        addDoc(collection(firestore, `users/${user.uid}/posts`), {
          text,
          ...(imageUrl && { imageUrl }),
          timestamp: serverTimestamp() as Timestamp,
          author: user.uid,
          innerCommentsIDs: [],
        } as PostData).then((DocumentReference) => {
          // add reactions
          Promise.all(
            ["👍", "👎", "❤️", "😂", "😯", "😢", "😡"].map((emoji) => {
              setDoc(
                doc(firestore, DocumentReference.path + "/reactions/" + emoji),
                {
                  reactors: [],
                }
              );
            })
          ).then(() => {
            // redirect to post page
            router.push(
              "/profile/" + user.uid + "/post/" + DocumentReference.id
            );
          });
        });
      }
    }
    return () => {};
  }, [image, imageUrl, isSending, router, text, user]);
  return (
    <>
      <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 bg-black w-[75vw] md:w-[50vw] max-w-screen-lg h-[75vh] lg:h-[64vh] 2xl:h-[45vh]  p-4 rounded-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        ></form>
        <Label className="font-bold my-2">Create a post</Label>
        <Textarea
          placeholder="What's on your mind?"
          value={text}
          className="flex-grow"
          onChange={(e) => setText(e.target.value)}
          required
        />
        <Label className="my-2" htmlFor="picture">
          Add an image
        </Label>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          className="flex-grow-0"
          onChange={(e) => setImage((e.target as HTMLInputElement).files?.[0])}
        />
        {isSending && <Progress className="mt-2 w-full" value={progress} />}
        <Button
          className="my-2 flex-grow-0 max-w-fit"
          disabled={isSending}
          variant={"outline"}
          type="submit"
          onClick={onSubmit}
        >
          Submit
        </Button>
      </div>
    </>
  );
}

export default Page;
