import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { EventRegistration } from '../models/eventRegistration.model'; 

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationService {
  private api = inject(ApiService);
  private path = 'registrations';

  // Inscribir al usuario actual en un evento.   
  register(eventId: number, userId: number, notes?: string): Observable<EventRegistration> {
    return this.api.post<EventRegistration>(this.path, { eventId, userId, notes });
  }

  // Obtener las inscripciones de un usuario
  getUserRegistrations(userId: number): Observable<EventRegistration[]> {
    return this.api.get<EventRegistration[]>(`${this.path}/my-registrations/${userId}`);
  }

  // Obtener los asistentes de un evento
  getEventAttendees(eventId: number): Observable<EventRegistration[]> {
    return this.api.get<EventRegistration[]>(`${this.path}/event/${eventId}`);
  }

  // Cancelar una inscripcion
  cancelRegistration(id: number): Observable<any> {
    return this.api.delete(`${this.path}/${id}`);
  }
}