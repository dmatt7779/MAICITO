import Toast from "../../../components/Toast";
import { ServiceRoomsProps } from "../../../interfaces";
import {
  DELETE,
  GET,
  POST,
  SUCCESS,
  URI_ROOMS,
  URL_PUBLIC_FILES,
  WARNING,
} from "../../../utils/constants";
import Statement from "../../../utils/statement";
import StatementChroma from "../../../utils/statementChroma";

class Services {
  rooms = async ({
    toggleLoader,
    inputTitle,
    inputIntroduction,
    inputWords,
    inputImage,
    files,
    resetForm,
    update,
    filesUpdate,
    path,
    id,
    oldTitle,
    toggleDialog,
    toggleRefresh
  }: ServiceRoomsProps) => {
    const title = inputTitle?.value.trim(),
      introduction = inputIntroduction?.value.trim(),
      words = inputWords?.value.trim(),
      image = inputImage?.files;

    if (title?.length === 0) {
      Toast({
        type: WARNING,
        message: "Por favor ingresar (Titulo)",
      });
      inputTitle?.focus();
      return;
    }

    if (introduction?.length === 0) {
      Toast({
        type: WARNING,
        message: "Por favor ingresar (Introducción)",
      });
      inputIntroduction?.focus();
      return;
    }

    if (image?.length === 0 && !update) {
      Toast({
        type: WARNING,
        message: "Por favor seleccionar (Imagen de sala)",
      });
      inputImage?.focus();
      return;
    }

    if (files?.length === 0 && filesUpdate?.length === 0) {
      Toast({
        type: WARNING,
        message: "Por favor seleccionar (Archivos)",
      });
      return;
    }
    else if(files?.length! > 30){
      Toast({
        type: WARNING,
        message: "No puede cargar mas de (30 Archivos)",
      });
      return;
    }


    await this.handleRoom({
      toggleLoader,
      title,
      introduction,
      words,
      inputImage,
      files,
      resetForm,
      update,
      filesUpdate,
      path,
      id,
      oldTitle,
      toggleDialog,
      toggleRefresh
    });
  };

  handleRoom = async ({
    toggleLoader,
    title,
    introduction,
    words,
    inputImage,
    files,
    resetForm,
    update,
    filesUpdate,
    path,
    id,
    oldTitle,
    toggleDialog
  }: ServiceRoomsProps) => {
    const formData = new FormData();

    formData.append("id", id!);
    formData.append("title", title!);
    formData.append("introduction", introduction!);
    formData.append("words", words!);
    formData.append("update", JSON.stringify(update));
    formData.append("filesUpdate", JSON.stringify(filesUpdate));
    formData.append("path", path!);

    if (inputImage && inputImage.files) {
      const imageArray: File[] = Array.from(inputImage.files).map((image) => {
        return new File([image], image.name, { type: image.type });
      });

      imageArray.forEach((image) => {
        formData.append("image", image);
      });
    }

    if (files) {
      const filesArray: File[] = Array.from(files).map((file) => {
        return new File([file], `${file.name}`, { type: file.type });
      });

      filesArray.forEach((file) => {
        formData.append("files[]", file);
      });
    }

    const dataSession = sessionStorage.getItem("isLogged");
    const { token } = JSON.parse(dataSession!);

    const response = await Statement({
      uri: URI_ROOMS,
      method: POST,
      param: formData,
      token: token,
      toggleLoader: toggleLoader,
    });

    if (!update) {
      Toast({
        type: response.Level,
        message: `${response.Code} - ${response.Message}`,
      });
    } else {
      if (response.Level !== SUCCESS) {
        Toast({
          type: response.Level,
          message: `${response.Code} - ${response.Message}`,
        });
      }
    }

    if (response.Level === SUCCESS) {
      const pathPublicRoom = await this.getPathPublicRoom(title!);

      if (!update) {
        await this.collectionCreatedOrDelete(POST, title!, "create_collection", toggleLoader);
      } else {
        if (oldTitle !== title) {
          await this.collectionCreatedOrDelete(DELETE, oldTitle!, "delete_collection", toggleLoader);
          await this.collectionCreatedOrDelete(POST, title!, "create_collection", toggleLoader);
        }
      }
      await this.loadPdfChroma(pathPublicRoom, title!, files!, toggleLoader);
      resetForm();

      setTimeout(toggleDialog!(), 1000);
    }
  };

  getPathPublicRoom = async (name: string) => {
    const dataSession = sessionStorage.getItem("isLogged");
    const { token } = JSON.parse(dataSession!);

    const response = await Statement({
      uri: `room.php?name=${name}`,
      token: token,
      method: GET,
    });
    return response;
  };

  collectionCreatedOrDelete = async (method: string, title: string, uri: string, toggleLoader: Function) => {
    try {
      const strTitle = title.replace(/\s/g, "_").toLowerCase();
      const response = await StatementChroma({
        uri: uri,
        method: method,
        oParam: strTitle,
        toggleLoader: toggleLoader
      });
      return response
    } catch (error) {
      console.error(error);
    }
  };

  loadPdfChroma = async (path: string, title: string, files: File[], toggleLoader: Function) => {
    try {
      const strTitle = title.replace(/\s/g, "_").toLowerCase();

      const nameFilesArray: string[] = Array.from(files).map((file) => {
        return `${URL_PUBLIC_FILES}${path}/${file.name}`;
      });
      const stringNameFiles = nameFilesArray.toString();
      const data = `${strTitle}|${stringNameFiles}`;

      const response = await StatementChroma({
        uri: "load_pdf",
        method: POST,
        oParam: data,
        toggleLoader: toggleLoader
      });
      return response
    } catch (error) {
      console.error(error);
    }
  };
}

export default new Services();
