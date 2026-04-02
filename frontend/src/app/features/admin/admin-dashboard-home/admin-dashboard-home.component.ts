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

@Component({
  selector: 'app-admin-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-home.component.html',
  styleUrl: './admin-dashboard-home.component.css'
})
export class AdminDashboardHomeComponent implements OnInit {
  // Inyección de servicios mediante inject()
  public authService = inject(AuthService);
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private reservationService = inject(ReservationService);

  // Variables de estado y UI
  public currentDate = new Date();
  public stats: StatCard[] = [];
  public loading = true;
  public isSystemOnline = false; // Estado de conexión a la BD

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Ejecuta todas las peticiones en paralelo. 
   * Si una falla, devuelve null para permitir que las demás carguen.
   */
  private loadDashboardData(): void {
    this.loading = true;

    forkJoin({
      products: this.productService.getProducts().pipe(catchError(err => { console.error('Error Productos:', err); return of(null); })),
      users: this.userService.getUsers().pipe(catchError(err => { console.error('Error Usuarios:', err); return of(null); })),
      events: this.eventService.getEvents().pipe(catchError(err => { console.error('Error Eventos:', err); return of(null); })),
      reservations: this.reservationService.getReservations().pipe(catchError(err => { console.error('Error Reservas:', err); return of(null); }))
    }).subscribe({
      next: (res) => {
        // Mapeo de datos a la interfaz StatCard
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

        // Lógica de Conectividad: 
        // Si al menos uno NO es null, el servidor Node.js y la BD están respondiendo.
        this.isSystemOnline = (res.products !== null || res.users !== null || res.events !== null || res.reservations !== null);
        
        this.loading = false;
      },
      error: (err) => {
        // Solo entra aquí si el forkJoin falla por un error no capturado
        console.error('Falla crítica de conexión:', err);
        this.isSystemOnline = false;
        this.loading = false;
      }
    });
  }

  /**
   * Genera un saludo amigable basado en la hora local.
   */
  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buen día';
    if (hour < 20) return '¡Buenas tardes';
    return '¡Buenas noches';
  }
}