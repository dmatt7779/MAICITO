import Toast from "../../../components/Toast";
import { RoomProps } from "../../../types";
import { URI_ROOMS } from "../../../utils/constants";
import Statement from "../../../utils/statement";

class Service {
  searchRoomId = async (
    id: string,
    toggleDialog: Function,
    toggleLoader?: Function,
    updateData?: (newData: Partial<RoomProps>) => void
  ) => {
    const fullUri = `${URI_ROOMS}/?id=${id}`,
      dataSession = sessionStorage.getItem("isLogged");
    const { token } = JSON.parse(dataSession!);

    const response = await Statement({
      uri: fullUri,
      method: "GET",
      token: token,
      toggleLoader,
    });

    if (response.hasOwnProperty("Level")) {
      Toast({
        type: response.Level,
        message: `${response.Code} - ${response.Message}`,
      });
      return;
    }

    if (response[0].hasOwnProperty("id")) {
      const { id, title, introduction, words, path, files, image } =
        response[0];

      updateData!({
        id,
        title,
        introduction,
        words,
        path,
        files,
        image,
      });
      toggleDialog();
    }
  };
}

export default new Service();
