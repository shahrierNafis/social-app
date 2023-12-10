import React, { useRef, useState } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import { getCroppedImg } from "@/app/lib/getCroppedImg";
import { Button } from "react-bootstrap";

function AvatarCrop({
  imgSrc,
  setImgBlob,
  setCropOn,
}: {
  imgSrc: string;
  setImgBlob: (blob: Blob) => void;
  setCropOn: (cropOn: boolean) => void;
}) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  // Center the crop on image load
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 45,
          height: 45,
        },
        1 / 1,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  }

  // set image blob
  async function onDoneCropping() {
    const image = imgRef.current;

    const previewCanvas = document.createElement("canvas");

    if (!image || !previewCanvas || !completedCrop) {
      return;
    }

    setImgBlob(await getCroppedImg(image, completedCrop));
    setCropOn(false);
  }

  return (
    <>
      <div className="absolute top-0 left-0 vh-100 vw-100 flex flex-col items-center justify-center">
        {!!imgSrc && (
          <>
            <ReactCrop
              circularCrop
              aspect={1}
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              style={{ maxWidth: "75vw", maxHeight: "75vh" }}
            >
              {/*eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                className="w-"
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <Button onClick={onDoneCropping}>Done</Button>
          </>
        )}
      </div>
    </>
  );
}

export default AvatarCrop;
