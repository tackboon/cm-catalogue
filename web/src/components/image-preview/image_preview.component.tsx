import { FC, ImgHTMLAttributes, useRef } from "react";
import { BsArrowCounterclockwise } from "react-icons/bs";

import styles from "./image_preview.module.scss";

type ImagePreviewProps = {
  previewURL: string;
  progress: number;
  isUploading: boolean;
  isError: boolean;
  onRetry: () => void;
} & ImgHTMLAttributes<HTMLImageElement>;

const ImagePreview: FC<ImagePreviewProps> = ({
  previewURL,
  progress,
  isUploading,
  isError,
  onRetry,
  ...props
}) => {
  const circleRef = useRef(null);

  if (circleRef.current) {
    const el = circleRef.current as SVGCircleElement;
    const strokeDashArray = 251;
    el.style.strokeDasharray = strokeDashArray.toString();
    el.style.strokeDashoffset = (
      strokeDashArray -
      strokeDashArray * progress
    ).toString();
  }

  return (
    <div
      className={`${styles["preview-container"]} ${
        isUploading ? styles["uploading"] : ""
      } ${isError ? styles["is-error"] : ""}`}
    >
      <img
        className={styles["img"]}
        src={previewURL}
        alt="preview"
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          if (el) {
            el.src = "/images/no-photo-available.png";
          }
        }}
        {...props}
      />

      <svg className={styles["bar"]} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" ref={circleRef} />
      </svg>

      <BsArrowCounterclockwise
        className={styles["retry"]}
        onClick={() => onRetry()}
      />
    </div>
  );
};
export default ImagePreview;
