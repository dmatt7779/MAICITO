import { ItemFileUploadProps } from "../../../interfaces";
import "../styles/item.css";

const Item = ({ name, isChecked, onChange }: ItemFileUploadProps) => {
  return (
    <li className="ds-item">
      <input
        className="ds-i-checkbox"
        type="checkbox"
        value={name}
        checked={isChecked.includes(name)}
        onChange={onChange}
      />
      <div className="ds-i-title">{name}</div>
    </li>
  );
};

export default Item;
