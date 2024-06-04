import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";
import Services from "./services";
import "./style/index.css";

const Login = () => {
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [visibleLoader, setVisibleLoader] = useState<boolean>(false);

  const refForm = useRef<HTMLFormElement>(null);
  const refEmail = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const toggleVisible = () => setVisiblePassword(!visiblePassword);
  const resetForm = () => {
    refForm.current?.reset();
  };
  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    Services.login({
      toggleLoader: setVisibleLoader,
      email: refEmail.current,
      password: refPassword.current,
      navigate,
      reset: resetForm,
    });
  };

  return (
    <section className="lg-container">
      <img
        src="/images/logo.jpg"
        alt="Ceipa-Logo"
        className="lg-logo"
      />
      <form
        className="lg-form"
        method="post"
        ref={refForm}
        onSubmit={handleLogin}
        autoComplete="off">
        <div className="lg-form-group">
          <label className="lg-form-label" htmlFor="txtEmail">
            E-mail
          </label>
          <div className="lg-form-group-input">
            <span className="lg-icon icon-user" />
            <input
              className="lg-form-input"
              ref={refEmail}
              type="email"
              id="txtEmail"
              name="txtEmail"
              placeholder="Ingresar E-mail"
              required
            />
          </div>
        </div>
        <div className="lg-form-group">
          <label className="lg-form-label" htmlFor="txtPassword">
            Password
          </label>
          <div className="lg-form-group-input">
            <span className="lg-icon icon-password" />
            <input
              className="lg-form-input"
              ref={refPassword}
              type={visiblePassword ? "text" : "password"}
              id="txtPassword"
              name="txtPassword"
              placeholder="Ingresar Password"
              required
            />
            <button
              className="lg-form-button"
              type="button"
              onClick={toggleVisible}>
              <span
                className={`lg-icon ${
                  visiblePassword ? "icon-eye-off" : "icon-eye-on"
                }`}
              />
            </button>
          </div>
        </div>
        <hr />
        <button className="lg-submit" type="submit">
          <span className="lg-icon icon-login"></span>
          Ingresar
        </button>
        <label>He olvidado mi contraseña</label>
      </form>
      <Loader/>
      <ToastContainer />
    </section>
  );
};

export default Login;
