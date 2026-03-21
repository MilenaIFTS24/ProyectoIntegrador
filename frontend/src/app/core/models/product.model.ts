export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image?: string;
  productType: 'tea' | 'craft';
  
  // Atributos de Té
  brand?: string;
  type?: string;
  origin?: string;
  hasCaffeine?: boolean;
  isOrganic?: boolean;
  isFairTrade?: boolean;
  format?: string;
  weightPerUnit?: number;

  // Atributos de Artesanía
  brandArtist?: string;
  category?: string;
  creationDate?: string;
  weight?: number;
  isUnique?: boolean;
  materials?: string[]; 
  ecoFriendly?: boolean;

  // Auditoría (Sequelize)
  createdAt?: Date;
  updatedAt?: Date;
}