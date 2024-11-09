import Toast from "../../../components/Toast";
import { RecoverProps } from "../../../interfaces";
import { POST, SUCCESS, WARNING } from "../../../utils/constants";
import Statement from "../../../utils/statement";

class Services {
    reover = async ({
        toggleLoader,
        newpassword,
        confirmpassword,
        navigate,
        reset
    }: RecoverProps) => {
        const valueNewPassword = newpassword?.value.trim(),
            valueConfirmpassword = confirmpassword?.value.trim();

        if (valueNewPassword?.trim()?.length === 0) {
            Toast({
                type: WARNING,
                message: "Por favor ingresar (Nueva contraseña)",
            });
            newpassword?.focus();
            return;
        }

        if (valueConfirmpassword?.trim()?.length === 0) {
            Toast({
                type: WARNING,
                message: "Por favor ingresar (Confirmar contraseña)",
            });
            confirmpassword?.focus();
            return;
        }

        if (valueNewPassword !== valueConfirmpassword) {
            Toast({
                type: WARNING,
                message: "Las contraseñas ingresadas no coinciden",
            });
            confirmpassword?.focus();
            return;
        }

        await this.handleRecover({
            toggleLoader,
            valueNewPassword,
            valueConfirmpassword,
            navigate,
            reset
        });
    };
    handleRecover = async ({
        toggleLoader,
        valueNewPassword,
        navigate,
        reset
    }: RecoverProps) => {
        const uriPost = `recover.php`,
            formData = new FormData();

        formData.append("password", valueNewPassword!);

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

        if (response.Level === SUCCESS && navigate) {
            reset();
            navigate("/login");
        }
    };
}

export default new Services();
