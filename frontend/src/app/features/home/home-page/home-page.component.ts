import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event as CalendarEvent } from '../../../core/models/event.model';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  private eventService = inject(EventService);

  public upcomingEvents = signal<CalendarEvent[]>([]);

  ngOnInit(): void {
    this.getUpcomingEvent();
  }

  // Obtener los 3 próximos eventos
  getUpcomingEvent(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        const today = new Date().toISOString().split('T')[0];
        const upcoming = events
          .filter(e => e.date >= today)
          .sort((a, b) => a.date.localeCompare(b.date));

        if (upcoming.length > 0) {
          this.upcomingEvents.set(upcoming.slice(0, 3));
        }
      }
    });
  }

  // Desplazarse a un elemento
  scrollTo(selector: string): void {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Navegar a la página de eventos
  /* navigateToEvents(): void {
    this.router.navigate(['/events']); 
  } */
}