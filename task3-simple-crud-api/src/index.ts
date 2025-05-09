import { createServer } from "./server";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get port from environment or use default
const PORT = parseInt(process.env.PORT || '4000', 10);

// Create and start server
createServer(PORT);