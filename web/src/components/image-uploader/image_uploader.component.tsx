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

  // handle single file upload
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files.length > 0) {
      // stop previous upload if new upload detected
      dispatch(stopAndRemoveAllStart());

      // upload file
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        dispatch(addUpload(files[i]));
      }
    }
  };

  // handle multiple file upload
  const onDrop = (files: File[]) => {
    for (let i = 0; i < files.length; i++) {
      dispatch(addUpload(files[i]));
    }
  };

  // configure dropzone for multiple file upload
  // only allow png/jpg file upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDrop,
  });

  // clean up all file upload on unmount
  useEffect(() => {
    return () => {
      dispatch(stopAndRemoveAllStart());
    };
  }, [dispatch]);

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
