import { ReservationItem } from './reservationItem.model';

export interface Reservation {
  id?: number;              
  userId: number;           
  totalAmount: number;      
  status: 'pendiente' | 'listo' | 'entregado' | 'cancelado';
  pickupDate?: Date | string;
  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;

  // array de items
  items: ReservationItem[];
}