import { StatementChromaProps } from "../interfaces";
import { GET, URL_CHROMA } from "./constants";

const StatementChroma = async ({
  uri,
  method,
  param,
  oParam,
  toggleLoader,
}: StatementChromaProps) => {
  try {
    if (toggleLoader) toggleLoader(true);

    const request =
      method === GET
        ? await Get({ uri, method, param })
        : await PostAndPut({ uri, method, param, oParam });

    const response = await request.json();
    return response;
  } catch (error) {
    console.log(`Error : ${error}`);
  } finally {
    if (toggleLoader) toggleLoader(false);
  }
};

const Get = async ({ uri, method }: StatementChromaProps) => {
  const request = await fetch(`${URL_CHROMA}${uri}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    },
  });

  return request;
};

const PostAndPut = async ({ uri, method, param, oParam }: StatementChromaProps) => {
  const formatData = (param !== undefined) ? param : JSON.stringify(oParam)

  const request = await fetch(`${URL_CHROMA}${uri}`, {
    method,
    headers: {
      "Content-Type": "Application/json"
    },
    body: formatData
  });

  return request;
};

export default StatementChroma;