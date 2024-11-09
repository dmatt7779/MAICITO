import { FormEvent, useRef, useState } from "react";
import "./style/index.css";
import Loader from "../../components/Loader";
import { ToastContainer } from "react-toastify";
import services from "./services";
import { useNavigate } from "react-router-dom";

const Recover = () => {
    const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
    const [visibleLoader, setVisibleLoader] = useState<boolean>(false);

    const toggleVisible = () => setVisiblePassword(!visiblePassword);
    
    const navigate = useNavigate();
    const refForm = useRef<HTMLFormElement>(null);
    const refNewPassword = useRef<HTMLInputElement>(null);
    const refConfirmPassword = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        refForm.current?.reset();
    };

    const handleRecover = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        visibleLoader;
        
        services.reover({
            toggleLoader: setVisibleLoader,
            newpassword: refNewPassword.current,
            confirmpassword: refConfirmPassword.current,
            navigate,
            reset: resetForm
        })
    }

    return (
        <section className="rc-container">
            <img
                src="/images/logo.png"
                alt="Ceipa-Logo"
                className="rc-logo"
            />
            <form
                className="rc-form"
                method="post"
                ref={refForm}
                onSubmit={handleRecover}
                autoComplete="off">
                <div className="rc-form-group">
                    <label className="rc-form-label" htmlFor="txtNewPassword">
                        Nueva contraseña
                    </label>
                    <div className="rc-form-group-input">
                        <span className="rc-icon icon-password" />
                        <input
                            className="rc-form-input"
                            ref={refNewPassword}
                            type={visiblePassword ? "text" : "password"}
                            id="txtNewPassword"
                            name="txtNewPassword"
                            placeholder="Ingresar contraseña"
                            required
                        />
                        <button
                            className="rc-form-button"
                            type="button"
                            onClick={toggleVisible}
                        >
                            <span
                                className={`rc-icon ${visiblePassword ? "icon-eye-off" : "icon-eye-on"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
                <div className="rc-form-group">
                    <label className="rc-form-label" htmlFor="txtConfirmPassword">
                        Confirmar contraseña
                    </label>
                    <div className="rc-form-group-input">
                        <span className="rc-icon icon-password" />
                        <input
                            className="rc-form-input"
                            ref={refConfirmPassword}
                            type={visiblePassword ? "text" : "password"}
                            id="txtConfirmPassword"
                            name="txtConfirmPassword"
                            placeholder="Ingresar contraseña"
                            required
                        />
                    </div>
                </div>
                <hr />
                <button className="rc-submit" type="submit">
                    <span className="rc-icon icon-save"></span>
                    Restablecer
                </button>
            </form>
            <Loader />
            <ToastContainer />
        </section>
    )
}

export default Recover;