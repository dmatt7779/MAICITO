import { FormEvent, useEffect, useRef, useState } from "react";
import { ToastContainer as Toast } from "react-toastify";
import { useRooms } from "..";
import { INITIAL_CONTEXT_ROOM } from "../../../utils/constants";
import Services from "../services/dialog";
import "../styles/dialog.css";
import Form from "./form";
import Upload from "./upload";

const Dialog = () => {
  const {
    visibleDialog,
    toggleDialog,
    toggleLoader,
    id,
    title,
    introduction,
    words,
    image,
    files,
    path,
    updateData,
  } = useRooms();

  const [listFiles, setListFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [filesUpdate, setFilesUpdate] = useState<string[]>([]);

  const refDialog = useRef<HTMLDialogElement>(null);
  const refForm = useRef<HTMLFormElement>(null);
  const refTitle = useRef<HTMLInputElement>(null);
  const refIntroduction = useRef<HTMLTextAreaElement>(null);
  const refWords = useRef<HTMLInputElement>(null);
  const refImage = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    refForm.current?.reset();
    setListFiles([]);
    setImageUrl(null);
    setFilesUpdate([]);
    updateData!(INITIAL_CONTEXT_ROOM);
  };

  useEffect(() => {
    if (visibleDialog) {
      refDialog.current?.showModal();
    } else {
      refDialog.current?.close();
    }
  }, [visibleDialog]);

  useEffect(() => {
    if (refTitle.current) refTitle.current.value = title!;
    if (refIntroduction.current) refIntroduction.current.value = introduction!;
    if (refWords.current) refWords.current.value = words!.toString();
    setFilesUpdate(files!);
    setImageUrl(image!);
  }, [id, title, introduction, words, image, files]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
      }
    };

    const dialog = refDialog.current;
    if (dialog) {
      dialog.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (dialog) {
        dialog.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  const handleRooms = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const update = id?.trim() !== "" ? true : false;

    Services.rooms({
      toggleLoader: toggleLoader!,
      inputTitle: refTitle.current,
      inputIntroduction: refIntroduction.current,
      inputWords: refWords.current,
      inputImage: refImage.current,
      files: listFiles,
      resetForm,
      update: update,
      filesUpdate: filesUpdate,
      path: path,
      id: id,
    });
  };

  return (
    <dialog className="ds-dialog" ref={refDialog} onClose={resetForm}>
      <div className="ds-dl">
        <header className="ds-dl-header">
          <span className="ds-dl-h-icon icon-chat_card"></span>
          <div className="ds-dl-h-text">Registrar nueva sala chatbot</div>
          <button onClick={() => toggleDialog!()} className="ds-dl-h-button">
            <span className="icon-close"></span>
          </button>
        </header>
        <form
          className="ds-dl-body"
          method="POST"
          ref={refForm}
          onSubmit={handleRooms}
          autoComplete="off">
          <section className="ds-dl-b-main">
            <Form
              title={refTitle}
              introduction={refIntroduction}
              words={refWords}
              image={refImage}
              imageUrl={imageUrl!}
              setImageUrl={setImageUrl}
            />
            <Upload
              files={listFiles}
              setFiles={setListFiles}
              filesUpdate={filesUpdate}
              setFilesUpdate={setFilesUpdate}
            />
          </section>
          <footer className="ds-dl-footer">
            <button className="ds-dl-f-button" type="submit">
              <span className="ds-dl-f-b-icon icon-save"></span>
              Guardar
            </button>
          </footer>
        </form>
      </div>
      <Toast />
    </dialog>
  );
};

export default Dialog;
