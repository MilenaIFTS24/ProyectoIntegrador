// Modelo de usuario
export interface User {
  id?: number;
  fullName: string;
  birthDate: string;
  email: string;
  password?: string;
  isEmailVerified: boolean;
  isEnabled: boolean;
  phone?: string;
  address?: string;
  lastLogin?: Date | string;
  role: 'user' | 'admin';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Modelo opcional para crear o actualizar un usuario en el backend
export interface UserDTO extends Partial<User> {
  password?: string;
}