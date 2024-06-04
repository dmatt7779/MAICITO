import { ChangeEvent, LegacyRef, ReactNode } from "react";
import { RoomProps } from "../types";

export interface ProtectedRoutes {
  children?: ReactNode;
}

export interface ItemFileUploadProps {
  name: string;
  isChecked: string[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface UploadProps {
  files: File[] | undefined;
  setFiles: Function;
  filesUpdate?: string[] | null;
  setFilesUpdate: Function;
}

export interface StatementProps {
  uri: string;
  method: string;
  param?: FormData | string;
  token?: string | undefined;
  toggleLoader?: Function;
}

export interface ToastProps {
  type: string;
  message: string;
}

export interface LoginProps {
  toggleLoader: Function;
  email?: HTMLInputElement | null;
  valueEmail?: string;
  password?: HTMLInputElement | null;
  valuePassword?: string;
  navigate?: Function;
  reset: Function;
}

export interface RoomsProps {
  title: LegacyRef<HTMLInputElement> | null;
  introduction: LegacyRef<HTMLTextAreaElement> | null;
  words: LegacyRef<HTMLInputElement> | null;
  image: LegacyRef<HTMLInputElement> | null;
  imageUrl: string;
  setImageUrl: Function;
}

export interface ServiceRoomsProps {
  toggleLoader: Function;
  inputTitle?: HTMLInputElement | null;
  title?: string;
  inputIntroduction?: HTMLTextAreaElement | null;
  introduction?: string;
  inputWords?: HTMLInputElement | null;
  words?: string;
  inputImage?: HTMLInputElement | null;
  files?: File[];
  resetForm: Function;
  update?: Boolean;
  filesUpdate?: string[] | null;
  path?: string | null;
  id?: string | null;
}

export interface CardRoomsProps {
  id: string;
  title: string;
  words: string;
  files: string | number;
  created: string;
  toggleDialog: Function;
  toggleLoader: Function;
}

export interface DialogProps extends RoomProps {
  visibleDialog?: boolean;
  visibleLoader?: boolean;
  toggleDialog?: Function;
  toggleLoader?: Function;
  updateData?: (newData: Partial<RoomProps>) => void;
}

export interface ConfirmAlertProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}