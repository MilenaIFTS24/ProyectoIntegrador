export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image?: string;
  productType: 'té' | 'artesanía'; // Basado en tu enum de Postgres
  
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
  creationDate?: string; // En tu SQL es character varying
  weight?: number;
  isUnique?: boolean;
  materials?: string[]; // character varying(255) [] en SQL es un array en TS
  ecoFriendly?: boolean;

  // Auditoría (Sequelize)
  createdAt?: Date;
  updatedAt?: Date;
}