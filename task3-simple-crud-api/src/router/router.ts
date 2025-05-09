import { IncomingMessage, ServerResponse } from "http";
import {
  getUsers,
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "../controllers/user.controller";

export const handleRequest = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const url = req.url || "";
  const method = req.method || "";

  // Set CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Set default content type for respnses
  res.setHeader("Content-Type", "application/json");

  // Base API
  const apiBase = "/api/users";

  // Route handling logic
  try {
    // GET /api/users - get all users
    if (url === apiBase && method === "GET") {
      await getUsers(req, res);
      return;
    }

    // POST /api/users - create new user
    if (url === apiBase && method === "POST") {
      await createUserHandler(req, res);
      return;
    }

    // Handle /api/users/{userId} endpoints
    const userIdMatch = url.match(new RegExp(`^${apiBase}/([^/]+)$`));
    if (userIdMatch) {
      const userId = userIdMatch[1];

      // GET /api/users/{userId} - get user by ID
      if (method === "GET") {
        await getUserByIdHandler(req, res, userId);
        return;
      }

      // PUT /api/users/{userId} - update user
      if (method === "PUT") {
        await updateUserHandler(req, res, userId);
        return;
      }

      // DELETE /api/users/{userId} - delete user
      if (method === "DELETE") {
        await deleteUserHandler(req, res, userId);
        return;
      }
    }

    // If no route matches, return 404
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Endpoint not found" }));
  } catch (error) {
    console.error("Router error:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
};
