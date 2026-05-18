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

  createReservationService(reservation: Reservation): Observable<Reservation> {
    return this.api.post<Reservation>(this.path, reservation);
  }

  findAllReservationsService(status?: string): Observable<Reservation[]> {
    const url = status ? `${this.path}?status=${status}` : this.path;
    return this.api.get<Reservation[]>(url);
  }

  findReservationsByUserService(userId: number): Observable<Reservation[]> {
    return this.api.get<Reservation[]>(`${this.path}/user/${userId}`);
  }

  updateStatusService(id: number, status: string): Observable<any> {
    return this.api.patch(`${this.path}/${id}/status`, { status });
  }

  cancelReservationService(id: number): Observable<any> {
    return this.api.patch(`${this.path}/cancel/${id}`, {});
  }
}