import { StatementProps } from "../interfaces";
import { GET, URL } from "./constants";

// Normaliza CUALQUIER respuesta a algo consumible por el frontend:
// - Objetos con { Level, ... } y arrays (listas de salas) -> se devuelven intactos.
// - Strings sueltos (p. ej. el "Acceso denegado" del 401) -> se envuelven como error.
// - Body vacío o no-JSON (HTML de error) -> objeto de error con el status HTTP.
// Así el color del toast siempre sale del "Level" y nunca se rompe el flujo.
const normalizeResponse = async (request: Response) => {
  const text = await request.text();

  if (!text) {
    return request.ok
      ? { Level: "success", Message: "" }
      : { Level: "error", Code: `CEIPA${request.status}IA`, Message: "Respuesta vacía del servidor." };
  }

  try {
    const data = JSON.parse(text);
    if (typeof data === "string") {
      // Un string en una respuesta OK es legítimo (p. ej. el path_public de una
      // sala). Solo se envuelve como error si el status HTTP no es 2xx.
      if (request.ok) return data;
      return {
        Level: "error",
        Code: `CEIPA${request.status}IA`,
        Message: data,
      };
    }
    return data;
  } catch {
    return { Level: "error", Code: `CEIPA${request.status}IA`, Message: `Error ${request.status}.` };
  }
};

const Statement = async ({
  uri,
  method,
  param,
  token,
  toggleLoader,
}: StatementProps) => {
  try {
    if (toggleLoader) toggleLoader(true);

    const request =
      method === GET
        ? await Get({ uri, method, param, token })
        : await PostAndPut({ uri, method, param, token });

    return await normalizeResponse(request);
  } catch (error) {
    console.log(`Error : ${error}`);
    return { Level: "error", Code: "CEIPA000IA", Message: "No se pudo conectar con el servidor." };
  } finally {
    if (toggleLoader) toggleLoader(false);
  }
};

const Get = async ({ uri, method, token }: StatementProps) => {
  const request = await fetch(`${URL}${uri}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return request;
};

const PostAndPut = async ({ uri, method, param, token }: StatementProps) => {
  const request = await fetch(`${URL}${uri}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: param,
  });

  return request;
};

export default Statement;
