import { DialogProps } from "../../../interfaces";
import { INFO, URI_ROOMS } from "../../../utils/constants";
import Statement from "../../../utils/statement";

class Services {
  getRooms = async ({ toggleLoader }: DialogProps) => {
    const dataSession = sessionStorage.getItem("isLogged");
    const { token } = JSON.parse(dataSession!);

    const response = await Statement({
      uri: URI_ROOMS,
      method: "GET",
      token: token,
      toggleLoader
    });

    if (response.Level !== INFO) {
      return response;
    }
  };
}

export default new Services();
