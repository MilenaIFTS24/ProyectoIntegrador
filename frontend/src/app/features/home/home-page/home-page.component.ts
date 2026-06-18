import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
  private router = inject(Router);

  // Signal para almacenar el evento más cercano en el tiempo
  public nextEvent = signal<CalendarEvent | null>(null);

  ngOnInit(): void {
    this.getUpcomingEvent();
  }

  getUpcomingEvent(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        const today = new Date().toISOString().split('T')[0];
        // Filtrar eventos futuros y los ordenar por fecha
        const upcoming = events
          .filter(e => e.date >= today)
          .sort((a, b) => a.date.localeCompare(b.date));
        
        if (upcoming.length > 0) {
          this.nextEvent.set(upcoming[0]); // El primero es el más próximo
        }
      }
    });
  }

  scrollTo(selector: string): void {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  navigateToEvents(): void {
    this.router.navigate(['/events']); 
  }
}