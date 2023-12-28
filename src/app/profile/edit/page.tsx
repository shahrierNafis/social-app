"use client";
import AvatarCrop from "@/app/components/AvatarCrop";
import uploadUserPhoto from "@/app/lib/uploadUserPhoto";
import { auth } from "@/firebase";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import "react-image-crop/dist/ReactCrop.css";
import { updateProfile } from "firebase/auth";

function Page() {
  const [displayName, setDisplayName] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const [cropOn, setCropOn] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [imgBlob, setImgBlob] = useState<Blob>();

  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName!);
    }

    return () => {};
  }, [user]);

  // get image url from file
  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setCropOn(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  async function onClick() {
    if (!user) {
      return;
    }
    // Update
    setIsUpdating(true);

    await updateProfile(user, {
      displayName,
      // if imgBlob exists, upload photo and get url
      ...(imgBlob && { photoURL: await uploadUserPhoto(imgBlob, user.uid) }),
    });

    location.replace("/profile/" + user.uid);
  }

  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>displayName</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>photo</Form.Label>
          {imgSrc && (
            <Button className="m-2" onClick={() => setCropOn(true)}>
              Crop
            </Button>
          )}
          <Form.Control type="file" accept="image/*" onChange={onSelectFile} />
        </Form.Group>

        {isUpdating ? (
          <>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md cursor-not-allowed opacity-50"
              disabled
            >
              Updating...
            </button>
          </>
        ) : (
          <>
            {displayName !== user?.displayName || imgSrc ? (
              <button
                type="button"
                className="focus:outline-none text-black bg-yellow-700 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                onClick={onClick}
              >
                Update
              </button>
            ) : (
              <button
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                onClick={() => router.push("/profile")}
              >
                back
              </button>
            )}
          </>
        )}
      </Form>

      {cropOn && <AvatarCrop {...{ imgSrc, setImgBlob, setCropOn }} />}
    </>
  );
}

export default Page;
