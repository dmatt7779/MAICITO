import { useNavigate } from "react-router-dom";
import { useRooms } from "..";
import "../styles/header.css";

const Header = () => {
  const { toggleDialog } = useRooms();
  const navigate = useNavigate();

  const logOut = () => {
    const userConfirmed = window.confirm(
      "¿Estás seguro de que quieres cerrar sesion?"
    );

    if (userConfirmed) {
      sessionStorage.removeItem('isLogged')
      navigate("/login");
    }
  };

  return (
    <header className="ds-header">
      <button className="ds-hd-new" onClick={() => toggleDialog!()}>
        <span className="ds-hd-icon icon-chats"></span>
        <small className="ds-hd-text">Nuevo Chatbot</small>
      </button>
      <button className="ds-hd-user" onClick={logOut}>
        <span className="ds-hd-out-icon icon-logout"></span>
        <small className="ds-hd-text">Salida Segura</small>
      </button>
    </header>
  );
};

export default Header;
