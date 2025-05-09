import { handleRequest } from "./router/router";
import http from "http";

export const createServer = (port: number) => {
  const server = http.createServer(async (req, res) => {
    try {
      await handleRequest(req, res);
    } catch (error) {
      console.error("Server error:", error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Internal server error" }));
    }
  });

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  return server;
};
