export const URL = "/api/v1/";
export const URL_CHROMA = "/ubi/";
// Ruta del sistema de archivos DENTRO de los contenedores (volumen ubi-uploads,
// montado en /var/www/shared). Se envía al servicio Python (load_pdf), que abre
// el PDF desde esta misma ruta compartida. No es una URL del navegador.
export const URL_PUBLIC_FILES = "/var/www/shared/files/";
export const URL_PUBLIC_IMAGE = "/api/public/images/";
export const SUCCESS = "success";
export const INFO = "information";
export const WARNING = "warning";
export const GET = "GET";
export const POST = "POST";
export const DELETE = "DELETE";
export const URI_ROOMS = "room.php";
export const INITIAL_CONTEXT_ROOM = {
  id: "",
  title: "",
  introduction: "",
  words: 0,
  path: "",
  files: [],
  image: "",
};
export const ACTIVE = "ACTIVO";
export const INACTIVE = "INACTIVO";
