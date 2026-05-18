export interface Event {
  id?: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  description: string;
  type: 'taller' | 'feria' | 'presentacion' | 'degustacion' | 'actividad';
  location: string;
  isVirtual: boolean;
  isFree: boolean;
  price: number;
  requiresRegistration: boolean;
  maxCapacity?: number;
  organizerContact: string;
  promoImage?: string;
  materials?: string;
  isCancelledByRain?: boolean;
  currentRegistrations?: number; // Calculado por el backend
}