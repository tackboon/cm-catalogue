import { ChangeEvent, createRef, FC, useEffect } from "react";
import { ButtonProps } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";

import {
  addUpload,
  stopAndRemoveAllStart,
} from "../../store/tus-upload/tus_upload.action";
import styles from "./image_uploader.module.scss";

type ImageUploaderProps = {
  multiUpload: boolean;
} & ButtonProps;

const ImageUploader: FC<ImageUploaderProps> = ({ multiUpload, ...props }) => {
  const dispatch = useDispatch();
  const uploaderRef = createRef<HTMLInputElement>();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files.length > 0) {
      dispatch(stopAndRemoveAllStart());

      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        dispatch(addUpload(files[i]));
      }
    }
  };

  const onDrop = (files: File[]) => {
    for (let i = 0; i < files.length; i++) {
      dispatch(addUpload(files[i]));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDrop,
  });

  useEffect(() => {
    return () => {
      dispatch(stopAndRemoveAllStart());
    };
  }, []);

  return (
    <>
      {multiUpload ? (
        <div
          {...getRootProps()}
          className={`${styles["dropzone-uploader"]} ${
            isDragActive ? styles["drag"] : ""
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      ) : (
        <>
          <input
            type="file"
            ref={uploaderRef}
            className="d-none"
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            multiple={false}
          />
          <Button
            {...props}
            variant="outline-dark"
            onClick={() => {
              if (uploaderRef.current) {
                uploaderRef.current.click();
              }
            }}
          >
            Select Image
          </Button>
        </>
      )}
    </>
  );
};

export default ImageUploader;
