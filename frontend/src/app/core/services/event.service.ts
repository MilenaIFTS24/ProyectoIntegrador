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

  getEvents(): Observable<Event[]> {
    return this.api.get<Event[]>(this.path);
  }

  getEventById(id: number): Observable<Event> {
    return this.api.get<Event>(`${this.path}/${id}`);
  }

  createEvent(event: Event): Observable<Event> {
    return this.api.post<Event>(this.path, event);
  }

  updateEvent(id: string, event: Partial<Event>): Observable<any> {
    return this.api.put(`${this.path}/${id}`, event);
  }

  deleteEvent(id: string): Observable<any> {
    return this.api.delete(`${this.path}/${id}`);
  }
}