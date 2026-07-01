// Modelo de Reserva
export interface Reservation {
  id?: string;
  userId: string;
  contactEmail: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'debito' | 'credito' | 'contado' | 'billetera_virtual';
  paymentId?: string;
  pickupDate?: string | null;
  pickupTimeSlot: string;
  isEcoPackaging: boolean;
  clientNotes?: string;
  status: 'pendiente' | 'listo' | 'entregada' | 'cancelada';
  cancelledAt?: string;
  
  createdAt?: string;
  updatedAt?: string;
  
  items?: any[]; 
}