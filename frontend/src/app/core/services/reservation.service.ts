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

  // Crear una nueva reserva
  createReservation(reservation: any): Observable<any> {
    return this.api.post(this.path, reservation);
  }

  // Obtener todas las reservas
  getAll(): Observable<Reservation[]> {
    return this.api.get<Reservation[]>(this.path);
  }

  // Obtener todas las reservas de un usuario
  getUserReservations(userId: string): Observable<Reservation[]> {
    return this.api.get<Reservation[]>(`reservations/user/${userId}`);
  }

  // Obtener una reserva por ID
  getById(id: string): Observable<Reservation> {
    return this.api.get<Reservation>(`${this.path}/${id}`);
  }

  // Actualizar el estado de una reserva
  updateStatus(id: string, status: 'pendiente' | 'listo' | 'entregada' | 'cancelada'): Observable<any> {
    return this.api.put(`${this.path}/${id}/status`, { status });
  }

  // Actualizar reserva
  updateReservation(id: string, reservation: Partial<Reservation>): Observable<any> {
    return this.api.patch(`${this.path}/${id}`, reservation);
  }

  // Cancelar una reserva (estado)
  cancelReservation(id: string): Observable<any> {
    return this.api.patch(`reservations/cancel/${id}`, {});
  }

  // Eliminar una reserva
  deleteReservation(id: string): Observable<any> {
    return this.api.delete(`${this.path}/${id}`);
  }

}