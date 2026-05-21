import Toast from "../../../components/Toast";
import { RoomProps } from "../../../types";
import { DELETE, GET, POST, SUCCESS, URI_ROOMS } from "../../../utils/constants";
import Statement from "../../../utils/statement";
import StatementChroma from "../../../utils/statementChroma";

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
      method: GET,
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

  updateStateRoom = async (id: string, state: string, refresh: Function) => {
    const formData = new FormData();

    formData.append("id", id);
    formData.append("state", state);
    formData.append("type", "updateStateRoom");

    const dataSession = sessionStorage.getItem("isLogged");
    const { token } = JSON.parse(dataSession!);

    await Statement({
      uri: URI_ROOMS,
      method: POST,
      param: formData,
      token: token
    });
    await this.deleteChroma(DELETE);
    refresh!()
  };

  deleteRoom = async (id: string, title: string, refresh: Function) => {
    const formData = new FormData();

    formData.append("id", id);
    formData.append("type", "deleteRoom");

    const dataSession = sessionStorage.getItem("isLogged");
    const { token } = JSON.parse(dataSession!);

    const response = await Statement({
      uri: URI_ROOMS,
      method: POST,
      param: formData,
      token: token
    });

    if (response.Level === SUCCESS) {
      this.deleteChroma(title)
      refresh!()
    }
  }

  deleteChroma = async (title: string) => {
    try {
      const strTitle = title.replace(/\s/g, "_").toLowerCase();
      const response = await StatementChroma({
        uri: "delete_collection",
        method: DELETE,
        oParam: strTitle,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Service();
