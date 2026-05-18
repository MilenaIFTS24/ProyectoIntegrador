export interface Event {
  id?: number;              
  name: string;             
  description: string;
  date: Date | string;      
  time: string;             
  location: string;         
  maxCapacity?: number;     
  requiresRegistration: boolean; 
  type: 'taller' | 'feria' | 'degustacion' | 'otro'; 
  imageUrl?: string;        
  status: 'programado' | 'en_curso' | 'finalizado' | 'cancelado';
  currentRegistrations?: number;
  
  createdAt?: Date;
  updatedAt?: Date;
}