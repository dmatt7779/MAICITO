import { DialogProps } from "../../../interfaces";
import { GET, INFO, URI_ROOMS, WARNING } from "../../../utils/constants";
import Statement from "../../../utils/statement";

class Services {
  getRooms = async ({ toggleLoader }: DialogProps) => {
    const dataSession = sessionStorage.getItem("isLogged");
    const { token } = JSON.parse(dataSession!);

    const response = await Statement({
      uri: URI_ROOMS,
      method: GET,
      token: token,
      toggleLoader
    });

    if (response.Level !== INFO) {
      return response;
    }
  };

  getRoomByTitle = async ({ toggleLoader, nameTitle }: DialogProps) => {
    const dataSession = sessionStorage.getItem("isLogged");
    const { token } = JSON.parse(dataSession!);
    const fullUri = `${URI_ROOMS}/?title=${nameTitle}`;

    const response = await Statement({
      uri: fullUri,
      method: GET,
      token: token,
      toggleLoader
    });

    if (response.Level !== WARNING) {
      return response;
    }
  };
}

export default new Services();
