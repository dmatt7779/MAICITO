import { ChangeEvent } from "react";
import { RoomsProps } from "../../../interfaces";
import "../styles/form.css";

const Form = ({
  title,
  introduction,
  words,
  image,
  imageUrl,
  setImageUrl,
}: RoomsProps) => {
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <article className="ds-field">
      <div className="ds-form-group">
        <label
          className="ds-form-label"
          htmlFor="txtTitle"
          title="First text of field title">
          Title
        </label>
        <input
          className="ds-form-input"
          type="text"
          ref={title}
          id="txtTitle"
          name="txtTitle"
          placeholder="Ingresar titulo"
          required
        />
      </div>
      <div className="ds-form-group">
        <label
          className="ds-form-label"
          htmlFor="txtIntroduction"
          title="Second text of field introduction">
          Introducción
        </label>
        <textarea
          className="ds-form-input ds-form-textarea"
          ref={introduction}
          id="txtIntroduction"
          name="txtIntroduction"
          placeholder="Ingresar descripción breve"
          required></textarea>
      </div>
      <div className="ds-form-group">
        <label
          className="ds-form-label"
          htmlFor="txtLetter"
          title="Third text of field letters">
          Total Palabras
        </label>
        <input
          className="ds-form-input"
          type="text"
          ref={words}
          id="txtLetter"
          name="txtLetter"
          placeholder="Cantidad de palabras encontradas"
          disabled
        />
      </div>
      <div className="ds-form-group">
        <label
          className="ds-form-label"
          htmlFor="txtLetter"
          title="Four text of field image">
          Imagen de Sala
        </label>
        <div className="ds-form-imageContent">
          <label className="ds-form-image" htmlFor="txtImage">
            <input
              type="file"
              ref={image}
              id="txtImage"
              name="txtImage"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
            />
          </label>
          <img src={!imageUrl ? "/images/no-image.png" : imageUrl} />
        </div>
      </div>
    </article>
  );
};

export default Form;
