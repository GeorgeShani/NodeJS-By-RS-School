import { User, UserCreateDTO, UserUpdateDTO } from "../models/user.model";
import { v4 as uuidv4 } from "uuid";

// In-memory database
let users: User[] = [];

// Function to validate UUID format
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  return [...users];
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  if (!isValidUUID(id)) {
    throw new Error("Invalid user ID format");
  }

  const user = users.find(user => user.id === id);
  return user || null;
};

// Create new user
export const createUser = async (userData: UserCreateDTO): Promise<User> => {
  // Validate required fields
  if (!userData.username || userData.age === undefined || !Array.isArray(userData.hobbies)) {
    throw new Error('Missing required fields: username, age, and hobbies are required');
  }

  const newUser: User = {
    id: uuidv4(),
    username: userData.username,
    age: userData.age,
    hobbies: userData.hobbies
  };

  users.push(newUser);
  return newUser;
};

// Update existing user
export const updateUser = async (id: string, userData: UserUpdateDTO): Promise<User | null> => {
  if (!isValidUUID(id)) {
    throw new Error("Invalid user ID format");
  }

  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return null;

  // Update user data
  users[userIndex] = {
    ...users[userIndex],
    ...userData,
  };

  return users[userIndex];
};

// Delete user
export const deleteUser = async (id: string): Promise<boolean> => {
  if (!isValidUUID(id)) {
    throw new Error('Invalid user ID format');
  }
  
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  
  return users.length < initialLength;
};

// Helper function to get a reference to the users array (for clustering)
export const getUsersRef = (): User[] => {
  return users;
};

// Helper function to set users array (for clustering)
export const setUsers = (newUsers: User[]): void => {
  users = [...newUsers];
};