import styles from "./imageCropper.module.scss";
import { useState, useRef } from "react";
import { ImageBorder, Button } from "../../atoms";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropper = ({ setUrl, url, setFile, payload, setToggle }) => {
  const [crop, setCrop] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [fileDataURL, setFileDataURL] = useState("");

  const imageRef = useRef();

  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  const getCroppedImg = (image, crop) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = payload.name;
        setFileDataURL(window.URL.createObjectURL(blob));
        resolve(new File([blob], payload.name, { type: "image/png" }));
      }, "image/png");
    });
  };

  const makeClientCrop = async (crop) => {
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImg(imageRef.current, crop);
      setCroppedImage(croppedImage);
    }
  };

  async function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 6 / 6));
  }

  return (
    <div className={styles.cropContainer}>
      <div className={styles.box}>
        <div className={styles.first}>
          <ReactCrop
            crop={crop}
            onChange={(_, pc) => setCrop(pc)}
            onComplete={makeClientCrop}
            aspect={6 / 6}
          >
            <img ref={imageRef} src={payload.url} onLoad={onImageLoad} />
          </ReactCrop>
        </div>
        <div className={styles.second}>
          <div className={styles.preview}>
            <ImageBorder
              src={fileDataURL}
              alt="image"
              width="180px"
              height="180px"
            />
          </div>
          <Button
            model="button2"
            value="Done"
            onClick={(e) => {
              e.preventDefault;
              setFile(croppedImage);
              setUrl(fileDataURL);
              setToggle(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
