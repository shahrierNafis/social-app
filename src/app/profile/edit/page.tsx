"use client";
import AvatarCrop from "@/app/components/AvatarCrop";
import uploadUserPhoto from "@/app/lib/uploadUserPhoto";
import { auth } from "@/firebase";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useAuthState } from "react-firebase-hooks/auth";
import "react-image-crop/dist/ReactCrop.css";
import { updateProfile } from "firebase/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function Page() {
  const [displayName, setDisplayName] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const [cropOn, setCropOn] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [imgBlob, setImgBlob] = useState<Blob>();

  const [isUpdating, setIsUpdating] = useState(false);

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
      <form className="m-2">
        <Label>displayName</Label>
        <Input
          type="text"
          placeholder=""
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <Label>photo</Label>
        {imgSrc && (
          <Button type="button" className="m-2" onClick={() => setCropOn(true)}>
            Crop
          </Button>
        )}
        <Input
          className="my-2 text-white"
          type="file"
          accept="image/*"
          onChange={onSelectFile}
        />

        {isUpdating ? (
          <>
            <Button disabled variant={"secondary"}>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </Button>
          </>
        ) : (
          <>
            {displayName !== user?.displayName || imgSrc ? (
              <>
                <Button type="button" onClick={onClick}>
                  Update
                </Button>{" "}
                <Link href={"/profile/" + user?.uid}>
                  <Button variant={"destructive"}>Cancel</Button>
                </Link>
              </>
            ) : (
              <Link href={"/profile/" + user?.uid}>
                <Button variant={"secondary"}>back</Button>
              </Link>
            )}
          </>
        )}
      </form>

      {cropOn && <AvatarCrop {...{ imgSrc, setImgBlob, setCropOn }} />}
    </>
  );
}

export default Page;
