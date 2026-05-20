import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Modelo
import { StatCard } from '../../../core/models/stat-card.model';

// Servicios Core
import { ProductService } from '../../../core/services/product.service';
import { UserService } from '../../../core/services/user.service';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard-home.component.html',
  styleUrl: './admin-dashboard-home.component.css'
})
export class AdminDashboardHomeComponent implements OnInit {
  public authService = inject(AuthService);
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private reservationService = inject(ReservationService);

  public currentDate = new Date();
  public stats: StatCard[] = [];
  public loading = true;
  public isSystemOnline = false;

  ngOnInit(): void {
    // Solo cargar datos si el rol es Admin
    if (this.authService.isAdmin()) {
      this.loadDashboardData();
    } else {
      this.loading = false;
    }
  }

  private loadDashboardData(): void {
    this.loading = true;

    forkJoin({
      products: this.productService.getProducts().pipe(catchError(err => { console.error('Error Productos:', err); return of(null); })),
      users: this.userService.getUsers().pipe(catchError(err => { console.error('Error Usuarios:', err); return of(null); })),
      events: this.eventService.getEvents().pipe(catchError(err => { console.error('Error Eventos:', err); return of(null); })),
      reservations: this.reservationService.getAll().pipe(catchError(err => { console.error('Error Reservas:', err); return of(null); }))
    }).subscribe({
      next: (res) => {
        this.stats = [
          { 
            label: 'Productos', 
            value: res.products ? res.products.length : 'Error', 
            icon: 'bi-box-seam', 
            color: '#8B6E4A',
            error: res.products === null 
          },
          { 
            label: 'Usuarios', 
            value: res.users ? res.users.length : 'Error', 
            icon: 'bi-people', 
            color: '#3CB371',
            error: res.users === null
          },
          { 
            label: 'Eventos', 
            value: res.events ? res.events.length : 'Error', 
            icon: 'bi-calendar-event', 
            color: '#6082B6',
            error: res.events === null
          },
          { 
            label: 'Reservas', 
            value: res.reservations ? res.reservations.length : 'Error', 
            icon: 'bi-journal-check', 
            color: '#D4A559',
            error: res.reservations === null
          }
        ];

        this.isSystemOnline = (res.products !== null || res.users !== null || res.events !== null || res.reservations !== null);
        this.loading = false;
      },
      error: (err) => {
        console.error('Falla crítica de conexión:', err);
        this.isSystemOnline = false;
        this.loading = false;
      }
    });
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buen día';
    if (hour < 20) return '¡Buenas tardes';
    return '¡Buenas noches';
  }
}