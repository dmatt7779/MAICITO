import { useRooms } from "..";
import { CardRoomsProps } from "../../../interfaces";
import Service from "../services/card";
import "../styles/card.css";

const Card = ({
  id,
  title,
  files,
  words,
  created,
  toggleLoader,
  toggleDialog,
}: CardRoomsProps) => {
  const { updateData } = useRooms();

  const handleSearchRoom = async (id: string) => {
    await Service.searchRoomId(id, toggleDialog, toggleLoader, updateData);
  };

  return (
    <section className="ds-card" key={id}>
      <div className="ds-cd-square ds-cd-s-not-trained">
        <small className="ds-cd-sq-text">Entrenando</small>
        <span className="ds-cd-sq-icon icon-trained"></span>
      </div>
      <article className="ds-cd-rectangle">
        <small className="ds-cd-rt-date">{created}</small>
        <h6 className="ds-cd-rt-title">{title}</h6>
        <hr className="ds-cd-rt-divide" />
        <span className="ds-cd-rt-item">
          <small className="ds-cd-rt-i-title">Tot. Archivos</small>
          <small className="ds-cd-rt-i-text">{`${files} archivos`}</small>
        </span>
        <span className="ds-cd-rt-item">
          <small className="ds-cd-rt-i-title">Tot. Palabras</small>
          <small className="ds-cd-rt-i-text">{`${words} palabras`}</small>
        </span>
        <div className="ds-cd-buttons">
          <button
            className="ds-cd-b-button"
            onClick={() => handleSearchRoom(id)}>
            <span className="icon-edit"></span>
            Editar
          </button>
          <button className="ds-cd-b-button">
            <span className="icon-delete"></span>
            Eliminar
          </button>
        </div>
      </article>
    </section>
  );
};

export default Card;
