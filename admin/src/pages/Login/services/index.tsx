import Toast from "../../../components/Toast";
import { LoginProps } from "../../../interfaces";
import { SUCCESS, WARNING } from "../../../utils/constants";
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
      method: "POST",
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
}

export default new Services();
