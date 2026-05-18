import { Product } from './product.model';

export interface ReservationItem {
  id?: number;              
  reservationId?: number;   
  productId: number;        
  quantity: number;         
  unitPrice: number;        
  
  // para mostrar datos del producto en la interfaz
  product?: Product;
}