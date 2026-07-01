import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private api = inject(ApiService);
  private path = 'events';

  // Obtener todos los eventos
  getEvents(): Observable<Event[]> {
    return this.api.get<Event[]>(this.path);
  }

  // Obtener un evento por ID
  getEventById(id: number): Observable<Event> {
    return this.api.get<Event>(`${this.path}/${id}`);
  }

  // Crear un nuevo evento
  createEvent(event: Event): Observable<Event> {
    return this.api.post<Event>(this.path, event);
  }

  // Actualizar un evento
  updateEvent(id: string, event: Partial<Event>): Observable<any> {
    return this.api.put(`${this.path}/${id}`, event);
  }

  // Eliminar un evento
  deleteEvent(id: string): Observable<any> {
    return this.api.delete(`${this.path}/${id}`);
  }
}