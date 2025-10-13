import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Reservation } from '../models/reservation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private _apiService: ApiService) { }

  getReservations(): Observable<Reservation[]> {
    return this._apiService.get<Reservation[]>('reservas');
  };

  getReservationById(id: number): Observable<Reservation> {
    return this._apiService.get<Reservation>(`reservas/${id}`);
  };

  addReservation(reservation: Omit<Reservation, 'id'>): Observable<Reservation> {
    return this._apiService.post<Reservation>('reservas', reservation);
  };

  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this._apiService.put<Reservation>(`reservas/${reservation.id}`, reservation);
  };

  deleteReservation(id: number): Observable<void> {
    return this._apiService.delete<void>(`reservas/${id}`);
  };
  
}
