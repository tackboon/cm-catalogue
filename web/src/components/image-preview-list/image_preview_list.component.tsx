import { useDispatch, useSelector } from "react-redux";
import { FC } from "react";

import {
  removeUpload,
  retryUpload,
} from "../../store/tus-upload/tus_upload.action";
import { selectUploads } from "../../store/tus-upload/tus_upload.selector";
import ImagePreviewItem from "../image-preview-item/image_preview_item.component";

type ImagePreviewListProps = {
  selectedPreview: string;
  setSelectedPreview: (fileID: string) => void;
  uploadedFiles: string[];
  removeUploadedFiles: (fileID: string) => void;
};

const ImagePreviewList: FC<ImagePreviewListProps> = ({
  selectedPreview,
  setSelectedPreview,
  uploadedFiles,
  removeUploadedFiles,
}) => {
  const dispatch = useDispatch();
  const uploads = useSelector(selectUploads);
  const uploadKeys = Object.keys(uploads);

  const handleRemoveUpload = (fileID: string, key: string) => {
    if (fileID === selectedPreview) {
      setSelectedPreview("");
    }

    if (key !== "") {
      dispatch(removeUpload(key));
    } else {
      removeUploadedFiles(fileID);
    }
  };

  const handleSelectPreview = (fileID: string) => {
    setSelectedPreview(fileID);
  };

  return (
    <div>
      {uploadKeys.map((key) => {
        const fileName = uploads[key].file.name;
        const fileID = uploads[key].id;
        const previewURL = URL.createObjectURL(uploads[key].file);
        const progress = uploads[key].progress;
        const isUploading = uploads[key].isUploading;
        const isError = uploads[key].error !== "";
        const onRetry = () => {
          dispatch(retryUpload(key));
        };

        return (
          <ImagePreviewItem
            key={key}
            uploadKey={key}
            fileID={fileID}
            fileName={fileName}
            previewURL={previewURL}
            progress={progress}
            isUploading={isUploading}
            isError={isError}
            isPreview={selectedPreview === fileID}
            onRetry={onRetry}
            handleSelectPreview={handleSelectPreview}
            handleRemoveUpload={handleRemoveUpload}
          />
        );
      })}

      {uploadedFiles?.map((uploadedFileID) => {
        const fileName = uploadedFileID;
        const fileID = uploadedFileID;
        const previewURL = `${process.env.REACT_APP_UPLOADER_ENDPOINT}/${uploadedFileID}`;
        const progress = 0;
        const isUploading = false;
        const isError = false;
        const onRetry = () => {};

        return (
          <ImagePreviewItem
            key={Math.floor(Math.random() * 1000000) + "_" + Date.now()}
            uploadKey={""}
            fileID={fileID}
            fileName={fileName}
            previewURL={previewURL}
            progress={progress}
            isUploading={isUploading}
            isError={isError}
            isPreview={selectedPreview === fileID}
            onRetry={onRetry}
            handleSelectPreview={handleSelectPreview}
            handleRemoveUpload={handleRemoveUpload}
          />
        );
      })}
    </div>
  );
};

export default ImagePreviewList;
