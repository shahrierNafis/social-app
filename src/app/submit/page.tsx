"use client";
import { auth, firestore } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAuthState } from "react-firebase-hooks/auth";
import uploadImage from "../lib/uploadImage";
import imageCompression from "browser-image-compression";
import { ProgressBar } from "react-bootstrap";
import { useRouter } from "next/navigation";

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
          createdAt: serverTimestamp(),
          author: user.uid,
        }).then((DocumentReference) => {
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 bg-black w-[75vw] max-w-screen-md h-fit  p-4 rounded-lg">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="font-bold">Create a post</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="What's on your mind?"
              rows={typeof screen !== "undefined" ? screen.height / 100 : 3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Add an image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage((e.target as HTMLInputElement).files?.[0])
              }
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {isSending && <ProgressBar className="w-full" now={progress} />}
      </div>
    </>
  );
}

export default Page;
