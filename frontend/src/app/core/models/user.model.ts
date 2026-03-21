export interface User {
  id?: number;
  fullName: string;
  birthDate: string;
  email: string;
  password?: string;
  
  isEmailVerified?: boolean;
  isEnabled?: boolean;
  
  // Campos Opcionales
  phone?: string;
  address?: string;
  
  // Roles
  role?: 'user' | 'admin';

  // Datos de sesión y seguridad
  lastLogin?: Date;
  passwordRecoveryToken?: string;

  // Auditoría (timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}