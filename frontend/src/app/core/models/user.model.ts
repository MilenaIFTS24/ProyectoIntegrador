export interface User {
  id?: number;
  fullName: string;
  birthDate: string; // Se maneja como string para coincidir con el DATEONLY (ISO: YYYY-MM-DD)
  email: string;
  password?: string; // Opcional porque no siempre lo recibimos del backend por seguridad
  isEmailVerified: boolean;
  isEnabled: boolean;
  phone?: string;
  address?: string;
  lastLogin?: Date | string;
  role: 'user' | 'admin';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Interface opcional para enviar 
 * datos de creación/edición al backend
 */
export interface UserDTO extends Partial<User> {
  password?: string;
}