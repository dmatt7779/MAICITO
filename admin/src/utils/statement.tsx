import { StatementProps } from "../interfaces";
import { GET, URL } from "./constants";

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

    const response = await request.json();
    return response;
  } catch (error) {
    console.log(`Error : ${error}`);
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
