export interface User {
<<<<<<< HEAD
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
=======
    id: number;
>>>>>>> 4864eeea6d793df3d4157f227a1b69281b91fb65
}