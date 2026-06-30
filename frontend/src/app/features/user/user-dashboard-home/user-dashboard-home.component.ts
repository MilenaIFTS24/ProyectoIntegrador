import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { ProductService } from '../../../core/services/product.service';
import { EventService } from '../../../core/services/event.service';
import { forkJoin } from 'rxjs';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-user-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard-home.component.html',
  styleUrl: './user-dashboard-home.component.css'
})
export class UserDashboardHomeComponent implements OnInit {
  private authService = inject(AuthService);
  private reservationService = inject(ReservationService);
  private productService = inject(ProductService);
  private eventService = inject(EventService);

  public currentDate = new Date();
  public loading = signal(true);
  public stats = signal({
    totalReservations: 0,
    activeReservations: 0,
    totalProducts: 0,
    upcomingEvents: 0
  });

  // Computed signals desde AuthService
  public userName = this.authService.userName;
  public userEmail = computed(() => this.authService.getCurrentUser()?.email || '');

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);

    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
      this.loading.set(false);
      return;
    }

    forkJoin({
      userReservations: this.reservationService.getUserReservations(userId).pipe(
        catchError(() => of([]))
      ),
      products: this.productService.getProducts().pipe(
        catchError(() => of([]))
      ),
      events: this.eventService.getEvents().pipe(
        catchError(() => of([]))
      )
    }).subscribe({
      next: (res) => {
        const reservations = res.userReservations as any[];
        const products = res.products as any[];
        const events = res.events as any[];

        this.stats.set({
          totalReservations: reservations.length,
          activeReservations: reservations.filter(r => r.status !== 'cancelada' && r.status !== 'entregada').length,
          totalProducts: products.length,
          upcomingEvents: events.filter(e => e.date >= new Date().toISOString().split('T')[0]).length
        });

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
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