import Toast from "../../../components/Toast";
import { LoginProps } from "../../../interfaces";
import { GET, POST, SUCCESS, WARNING } from "../../../utils/constants";
import Statement from "../../../utils/statement";

class Services {
  login = async ({
    toggleLoader,
    email,
    password,
    navigate,
    reset,
  }: LoginProps) => {
    const valueEmail = email?.value.trim(),
      valuePassword = password?.value.trim();

    if (valueEmail?.length === 0) {
      Toast({
        type: WARNING,
        message: "Por favor ingresar (E-mail)",
      });
      email?.focus();
      return;
    }

    if (valuePassword?.length === 0) {
      Toast({
        type: WARNING,
        message: "Por favor ingresar (Password)",
      });
      password?.focus();
      return;
    }

    await this.handleLogin({
      toggleLoader,
      valueEmail,
      valuePassword,
      navigate,
      reset,
    });
  };
  handleLogin = async ({
    toggleLoader,
    valueEmail,
    valuePassword,
    navigate,
    reset,
  }: LoginProps) => {
    const uriPost = `signIn.php`,
      formData = new FormData();

    formData.append("email", valueEmail!);
    formData.append("password", valuePassword!);

    const response = await Statement({
      uri: uriPost,
      method: POST,
      param: formData,
      toggleLoader: toggleLoader,
    });

    if (response.Level !== SUCCESS) {
      Toast({
        type: response.Level,
        message: `${response.Code} - ${response.Message}`,
      });
      return;
    }

    if (navigate) {
      sessionStorage.setItem("isLogged", JSON.stringify(response));
      reset();
      navigate("/dashboard");
    }
  };
  recover = (email: HTMLInputElement | null, toggleLoader: Function) => {
    const valueEmail = email?.value.trim()

    if (valueEmail?.length === 0) {
      Toast({
        type: WARNING,
        message: "Por favor ingresar (E-mail)",
      });
      email?.focus();
      return;
    }

    this.handleRecover(valueEmail!, toggleLoader!);
  };
  handleRecover = async (email: string, toggleLoader: Function) => {
    const uriPost = `recover.php?email=${email}`
    const response = await Statement({
      uri: uriPost,
      method: GET,
      toggleLoader
    });

    if (response.Level) {
      Toast({
        type: response.Level,
        message: `${response.Code} - ${response.Message}`,
      });
      return;
    }
  }
}

export default new Services();
