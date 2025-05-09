import { IncomingMessage } from "http";

export const parseRequestBody = <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        if (body) {
          resolve(JSON.parse(body) as T);
        } else {
          resolve({} as T);
        }
      } catch (error) {
        reject(new Error("Invalid JSON format"));
      }
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
};
