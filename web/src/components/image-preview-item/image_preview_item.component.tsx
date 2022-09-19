import { FC, MouseEvent, useState } from "react";
import { BsFillPinAngleFill, BsFillTrashFill, BsXLg } from "react-icons/bs";

import ImagePreview from "../image-preview/image_preview.component";
import styles from "./image_preview_item.module.scss";

type ImagePreviewItemProps = {
  uploadKey: string;
  fileID: string;
  fileName: string;
  previewURL: string;
  progress: number;
  isUploading: boolean;
  isError: boolean;
  isPreview: boolean;
  onRetry: () => void;
  handleSelectPreview: (fileID: string) => void;
  handleRemoveUpload: (fileID: string, key: string) => void;
};

const ImagePreviewItem: FC<ImagePreviewItemProps> = ({
  uploadKey,
  fileID,
  fileName,
  previewURL,
  progress,
  isUploading,
  isError,
  isPreview,
  onRetry,
  handleSelectPreview,
  handleRemoveUpload,
}) => {
  // zoom image on image clicked
  const [zoomImageURL, setZoomImageURL] = useState("");
  const handleZoomIn = (e: MouseEvent<HTMLImageElement>) => {
    const el = e.target as HTMLImageElement;
    if (el) {
      setZoomImageURL(el.src);
    }
  };

  return (
    <>
      <div
        className={`${styles["row"]} ${
          fileID !== "" && isPreview ? styles["selected"] : ""
        }`}
      >
        <div className={styles["image-wrapper"]}>
          <ImagePreview
            previewURL={previewURL}
            progress={progress}
            isUploading={isUploading}
            isError={isError}
            onRetry={onRetry}
            style={{ cursor: "pointer" }}
            onClick={handleZoomIn}
          />
        </div>

        <p className={styles["image-name"]}>{fileName}</p>

        <div className={styles["btn"]}>
          <button
            type="button"
            className={`${styles["select-preview"]} ${
              fileID === "" ? "d-none" : ""
            }`}
            onClick={() => handleSelectPreview(fileID)}
          >
            <BsFillPinAngleFill />
          </button>
          <button
            type="button"
            className={styles["delete"]}
            onClick={() => handleRemoveUpload(fileID, uploadKey)}
          >
            <BsFillTrashFill />
          </button>
        </div>
      </div>

      <div
        className={`${styles["zoom-preview"]} ${
          zoomImageURL === "" ? "d-none" : "d-flex"
        }`}
      >
        <div className={styles["zoom-preview-wrapper"]}>
          <BsXLg
            className={styles["zoom-preview-close"]}
            onClick={() => setZoomImageURL("")}
          />
          <img src={zoomImageURL} alt="zoom-preview" />
        </div>
      </div>
    </>
  );
};

export default ImagePreviewItem;
