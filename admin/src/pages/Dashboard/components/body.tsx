import { useEffect, useState } from "react";
import { useRooms } from "..";
import { CardRoomsProps } from "../../../interfaces";
import Services from "../services/body";
import "../styles/body.css";
import Card from "./card";

const Body = () => {
  const { toggleDialog, toggleLoader } = useRooms();

  const [rooms, setRooms] = useState<CardRoomsProps[]>();

  useEffect(() => {
    const getRooms = async () => {
      const result = await Services.getRooms({ toggleLoader });
      setRooms(result);
    };
    getRooms();
  }, []);

  return (
    <div className="ds-body">
      {rooms &&
        rooms.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            title={item.title}
            files={item.files}
            words={item.words}
            created={item.created}
            toggleDialog={() => toggleDialog!()}
            toggleLoader={toggleLoader!}
          />
        ))}
    </div>
  );
};

export default Body;
