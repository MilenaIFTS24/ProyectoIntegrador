import { Event } from './event.model';
import { User } from './user.model'; 

export interface EventRegistration {
  id?: number;            
  userId: number;         
  eventId: number;        
  registrationDate?: Date | string; 
  notes?: string;         
  status?: 'confirmada' | 'cancelada' | 'asistio'; 

  event?: Event;          
  user?: Partial<User>;   
}