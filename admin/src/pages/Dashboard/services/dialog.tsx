import Toast from "../../../components/Toast";
import { ServiceRoomsProps } from "../../../interfaces";
import { SUCCESS, URI_ROOMS, WARNING } from "../../../utils/constants";
import Statement from "../../../utils/statement";

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
    id
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
      id
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
    id
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
      method: "POST",
      param: formData,
      token: token,
      toggleLoader: toggleLoader,
    });

    Toast({
      type: response.Level,
      message: `${response.Code} - ${response.Message}`,
    });

    if (response.Level === SUCCESS) {
      resetForm();
    }
  };
}

export default new Services();
