import { IncomingMessage, ServerResponse } from "http";
import { UserCreateDTO, UserUpdateDTO } from "../models/user.model";
import { parseRequestBody } from "../utils/request-parser";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  isValidUUID,
} from "../db/in-memory-db";

// Get all users
export const getUsers = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.statusCode = 200; // OK
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error("Error getting users:", error);
    res.statusCode = 500; // Internal Server Error
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
};

// Get user by ID
export const getUserByIdHandler = async (req: IncomingMessage, res: ServerResponse, id: string): Promise<void> => {
  try {
    if (!isValidUUID(id)) {
      res.statusCode = 400; // Bad Request
      res.end(JSON.stringify({ message: 'Invalid user ID format' }));
      return;
    }

    const user = await getUserById(id);
    if (!user) {
      res.statusCode = 404; // Not Found
      res.end(JSON.stringify({ message: `User with ID ${id} not found` }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(user));
  } catch (error) {
    console.error(`Error getting user with ID ${id}:`, error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

// Create new user
export const createUserHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const userData = await parseRequestBody<UserCreateDTO>(req);
    if (!userData.username || userData.age === undefined || !Array.isArray(userData.hobbies)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ 
        message: 'Missing required fields: username, age, and hobbies are required' 
      }));
      return;
    }

    const newUser = await createUser(userData);
    
    res.statusCode = 201; // Created
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(newUser));
  } catch (error) {
    console.error('Error creating user:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

// Update user
export const updateUserHandler = async (req: IncomingMessage, res: ServerResponse, id: string): Promise<void> => {
  try {
    if (!isValidUUID(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'Invalid user ID format' }));
      return;
    }

    const userData = await parseRequestBody<UserUpdateDTO>(req);
    const updatedUser = await updateUser(id, userData);
    if (!updatedUser) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: `User with ID ${id} not found` }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(updatedUser));
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

// Delete user
export const deleteUserHandler = async (req: IncomingMessage, res: ServerResponse, id: string): Promise<void> => {
  try {
    if (!isValidUUID(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'Invalid user ID format' }));
      return;
    }

    const deleted = await deleteUser(id);
    
    if (!deleted) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: `User with ID ${id} not found` }));
      return;
    }

    res.statusCode = 204; // No Content
    res.end();
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};