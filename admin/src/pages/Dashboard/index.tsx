import { useContext, useState } from "react";
import Loader from "../../components/Loader";
import { RoomProps } from "../../types";
import { INITIAL_CONTEXT_ROOM } from "../../utils/constants";
import { roomsContext } from "../../utils/context";
import Body from "./components/body";
import Dialog from "./components/dialog";
import Header from "./components/header";
import "./styles/index.css";

export const useRooms = () => useContext(roomsContext);

const Dashboard = () => {
  const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
  const [visibleLoader, setVisibleLoader] = useState<boolean>(false);
  const [contextData, setContextData] =
    useState<RoomProps>(INITIAL_CONTEXT_ROOM);

  const updateData = (newData: Partial<RoomProps>) => {
    setContextData((prevData) => ({ ...prevData, ...newData }));
  };

  const Param = {
    visibleDialog: visibleDialog,
    toggleDialog: () => setVisibleDialog(!visibleDialog),
    visibleLoader: visibleLoader,
    toggleLoader: setVisibleLoader,
    ...contextData,
    updateData,
  };

  return (
    <roomsContext.Provider value={Param}>
      <div className="ds-container">
        <Header />
        <Body />
        <Dialog />
        <Loader />
      </div>
    </roomsContext.Provider>
  );
};

export default Dashboard;
