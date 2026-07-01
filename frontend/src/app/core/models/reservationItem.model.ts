import { Product } from './product.model';

// Modelo de Item de Reserva
export interface ReservationItem {
  id?: number;              
  reservationId?: number;   
  productId: number;        
  quantity: number;         
  unitPrice: number;        

  product?: Product;
}