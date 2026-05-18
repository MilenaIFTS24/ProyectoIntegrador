import { ReservationItem } from './reservationItem.model';

export interface Reservation {
<<<<<<< HEAD
    id: number;
=======
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
>>>>>>> 5dcb2499a6bfe74d4e56c63bda162e8efec77b4a
}