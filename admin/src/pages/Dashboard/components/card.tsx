import { useRooms } from "..";
import { CardRoomsProps } from "../../../interfaces";
import { ACTIVE, INACTIVE} from "../../../utils/constants";
import Service from "../services/card";
import "../styles/card.css";
import { useState } from "react";

const Card = ({
  id,
  title,
  files,
  words,
  created,
  state,
  image,
  toggleLoader,
  toggleDialog,
  refresh,
}: CardRoomsProps) => {
  const { updateData } = useRooms();

  const handleSearchRoom = async (id: string) => {
    await Service.searchRoomId(id, toggleDialog, toggleLoader, updateData);
  };

  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyScript = (title: string) => {
    const codeHtml = `<script>
        window.Ceipa = {
            chatbotId : "${title.replace(/\s/g, "_").toLowerCase()}",
            imageRoom : "https://ubi.ceipa.edu.co/api/public/images/${image}"
        };
    </script>
    <script src="https://ubi.ceipa.edu.co/script/index.js"></script>`;

    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = codeHtml;
    textArea.style.position = 'fixed'; 
    textArea.style.left = '-9999px'; 
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopySuccess('Failed to copy!');
      setTimeout(() => setCopySuccess(''), 1500);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleStateActive = async (id: string, state: string) => {
    await Service.updateStateRoom(id, state, refresh!);
  };

  const handleDeleteRoom = async (id: string, title:string) => {
    const deleteConfirmed = window.confirm(
      "¿Desea eliminar el asistente?"
    );

    if (deleteConfirmed) {
      await Service.deleteRoom(id, title, refresh!);
    }
  }
  return (
    <section
      className={`ds-card ${state === ACTIVE ? "" : "ds-card-inactive"}`}
      key={id}>
      <div className={`ds-cd-square ${state === ACTIVE ? "ds-cd-s-active" : "ds-cd-s-inactive"}`}>
        <small className="ds-cd-sq-text">{state}</small>
        <span className={`ds-cd-sq-icon ${state === ACTIVE ? 'icon-active' : 'icon-inactive'}`}></span>
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
            disabled={state !== ACTIVE}
            className="ds-cd-b-button"
            title="Editar"
            onClick={() => handleSearchRoom(id)}>
            <span className="icon-edit"></span>
          </button>
          <button
            className="ds-cd-b-button"
            title={`Cambiar estado a (${state === ACTIVE ? INACTIVE : ACTIVE})`}
            onClick={() => handleStateActive(id, state)}>
            <span className="icon-power"></span>
          </button>
          <button
            className="ds-cd-b-button"
            title={`Eliminar asistente`}
            onClick={() => handleDeleteRoom(id, title)}>
            <span className="icon-delete"></span>
          </button>
          <button
            disabled={state !== ACTIVE}
            className="ds-cd-b-button"
            title="Copiar Script"
            onClick={() => handleCopyScript(title)}>
            <span className="icon-copy"></span> 
            {copySuccess && <span className="copy-success">{copySuccess}</span>} 
          </button>
        </div>
      </article>
    </section>
  );
};

export default Card;
