import { useEffect, useRef, useState } from "react";
import { useRooms } from "..";
import { CardRoomsProps } from "../../../interfaces";
import Services from "../services/body";
import "../styles/body.css";
import Card from "./card";

const Body = () => {
  const refTitle = useRef<HTMLInputElement>(null);
  const { toggleDialog, toggleLoader, isRefresh, toggleRefresh } = useRooms();

  const [rooms, setRooms] = useState<CardRoomsProps[]>();

  const getRooms = async () => {
    const result = await Services.getRooms({ toggleLoader });
    setRooms(result);
  };

  const searchRoomByTitle = async (nameTitle: string) => {
    const result = await Services.getRoomByTitle({ toggleLoader, nameTitle });
    setRooms(result);
  }

  useEffect(() => {
    const valueSearch = refTitle.current?.value;
    (valueSearch === "") ? getRooms() : searchRoomByTitle(valueSearch!)
  },[isRefresh]);

  return (
    <div>
      <div className="ds-search">
        <input 
          className="ds-search-input"
          ref={refTitle}
          type="search" 
          placeholder="Buscar sala por titulo"
        />
        <button 
          className="ds-search-button"
          type="button" 
          onClick={() => toggleRefresh!()}>Buscar</button>
      </div>
      <div className="ds-body">
        {rooms &&
          rooms.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              files={item.files}
              words={item.words}
              state={item.state}
              image={item.image}
              created={item.created}
              toggleDialog={() => toggleDialog!()}
              toggleLoader={toggleLoader!}
              refresh={toggleRefresh}
            />
          ))}
      </div>
    </div>
  );
};

export default Body;
