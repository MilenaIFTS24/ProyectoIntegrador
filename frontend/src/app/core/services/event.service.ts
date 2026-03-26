import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private _apiService: ApiService) { }

  getEvents(): Observable<Event[]> {
    return this._apiService.get<Event[]>('eventos');
  };

  getEventById(id: number): Observable<Event> {
    return this._apiService.get<Event>(`eventos/${id}`);
  };

  addEvent(event: Omit<Event, 'id'>): Observable<Event> {
    return this._apiService.post<Event>('eventos', event);
  };

  updateEvent(event: Event): Observable<Event> {
    return this._apiService.put<Event>(`eventos/${event.id}`, event);
  };

  deleteEvent(id: number): Observable<void> {
    return this._apiService.delete<void>(`eventos/${id}`);
  };
}
