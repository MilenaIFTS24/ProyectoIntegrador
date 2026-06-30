import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private api = inject(ApiService);
  private path = 'reservations';

  createReservation(reservation: any): Observable<any> {
    return this.api.post(this.path, reservation);
  }

  getUserReservations(userId: string): Observable<Reservation[]> {
    return this.api.get<Reservation[]>(`reservations/user/${userId}`);
  }

  getAll(): Observable<Reservation[]> {
    return this.api.get<Reservation[]>(this.path);
  }

  getById(id: string): Observable<Reservation> {
    return this.api.get<Reservation>(`${this.path}/${id}`);
  }

  updateStatus(id: string, status: 'pendiente' | 'listo' | 'entregada' | 'cancelada'): Observable<any> {
    return this.api.put(`${this.path}/${id}/status`, { status });
  }

  updateReservation(id: string, reservation: Partial<Reservation>): Observable<any> {
    return this.api.patch(`${this.path}/${id}`, reservation);
  }

  cancelReservation(id: string): Observable<any> {
    return this.api.patch(`reservations/cancel/${id}`, {});
  }

  deleteReservation(id: string): Observable<any> {
    return this.api.delete(`${this.path}/${id}`);
  }

}