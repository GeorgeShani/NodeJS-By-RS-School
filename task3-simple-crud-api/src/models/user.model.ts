export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface UserCreateDTO {
  username: string;
  age: number;
  hobbies: string[];
}

export interface UserUpdateDTO {
  username?: string;
  age?: number;
  hobbies?: string[];
}
