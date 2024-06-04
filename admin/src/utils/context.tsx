import { createContext } from "react";
import { DialogProps } from "../interfaces";

export const roomsContext = createContext<DialogProps>({
  visibleDialog: false,
  visibleLoader: false,
  toggleDialog: Function,
  toggleLoader: Function,
});
