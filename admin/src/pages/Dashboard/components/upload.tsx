import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { UploadProps } from "../../../interfaces";
import Services from "../services/upload";
import "../styles/upload.css";
import Item from "./item";

const TYPE_FILE = "application/pdf";

const Upload = ({
  files,
  setFiles,
  filesUpdate,
  setFilesUpdate,
}: UploadProps) => {
  const [isChecked, setIsChecked] = useState<string[]>([]);
  const inputFile = useRef<HTMLInputElement>(null);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    [...event.dataTransfer.files].forEach((item) => {
      if (item.type === TYPE_FILE) {
        setFiles((prevItem: File[]) => [...prevItem, item]);
      }
    });
  };

  const handleChangeInput = () => {
    [...inputFile.current?.files!].forEach((item) => {
      if (item.type === TYPE_FILE) {
        setFiles((prevItem: File[]) => [...prevItem, item]);
      }
    });
  };

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (checked) {
      setIsChecked([...isChecked, value]);
    } else {
      setIsChecked(isChecked.filter((item) => item !== value));
    }
  };

  const deleteFiles = () => {
    if (!filesUpdate) {
      setFiles(files?.filter((file) => isChecked.indexOf(file.name) === -1));
    } else {
      setFilesUpdate(
        filesUpdate?.filter(
          (filesUpdate) => isChecked.indexOf(filesUpdate) === -1
        )
      );
    }
    setIsChecked([]);
  };

  return (
    <article className="ds-upload">
      <section>
        <div
          className="ds-u-attach"
          onDragOver={Services.DragOver}
          onDragLeave={Services.DragLeave}
          onDrop={handleDrop}>
          <span className="ds-u-at-icon icon-attach"></span>
          <label className="ds-u-at-label" htmlFor="txtFiles">
            Haga clic aquí para cargar
          </label>{" "}
          o arrastre y suelte aquí
          <small className="ds-u-at-label-small">Solo archivos PDF</small>
        </div>
        <input
          type="file"
          name="txtFiles"
          id="txtFiles"
          accept="application/pdf"
          ref={inputFile}
          onChange={handleChangeInput}
          multiple
          hidden
        />
      </section>
      <section className="ds-u-list">
        <div className="ds-u-l">
          <h6 className="ds-u-l-title">Archivos cargados</h6>
          <button type="button" className="ds-u-l-button" onClick={deleteFiles}>
            <span className="ds-u-l-b-icon icon-delete"></span>
          </button>
        </div>
        <hr className="ds-u-l-title-divide" />
        <ul className="ds-u-l-list">
          {files?.map((file, index) => (
            <Item
              key={index}
              name={file.name}
              isChecked={isChecked}
              onChange={handleCheckbox}
            />
          ))}
          {filesUpdate?.map((file, index) => (
            <Item
              key={index}
              name={file}
              isChecked={isChecked}
              onChange={handleCheckbox}
            />
          ))}
        </ul>
      </section>
    </article>
  );
};

export default Upload;
