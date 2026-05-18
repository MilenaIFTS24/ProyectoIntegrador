import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
//import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent implements OnInit {
  private eventService = inject(EventService);
  private fb = inject(FormBuilder);
  //private notify = inject(NotificationService);

  public events = signal<Event[]>([]);
  public filteredEventList = signal<Event[]>([]);
  public loading = true;
  public errorMessage = '';
  public currentPage = 1;
  public itemsPerPage = 10;
  private readonly NAVBAR_OFFSET = 110;

  public eventForm = this.fb.group({
    id: [null as string | null],
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required]],
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    location: ['Tienda de Té', Validators.required],
    type: ['taller', Validators.required],
    maxCapacity: [10, [Validators.min(1)]],
    requiresRegistration: [true],
    isFree: [true],
    price: [0],
    organizerContact: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events.set(data);
        this.filteredEventList.set(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        //this.notify.toast('Error al cargar eventos', 'error');
      }
    });
  }

  filterResults(text: string): void {
    const term = text.toLowerCase().trim();
    this.filteredEventList.set(
      this.events().filter(e => e.title.toLowerCase().includes(term) || e.type.includes(term))
    );
    this.currentPage = 1;
  }

  updateEvent(event: Event): void {
    this.eventForm.reset();
    this.eventForm.patchValue({ ...event } as any);
    //this.notify.toast(`Editando: ${event.title}`, 'info');
    this.scrollTo('.event-card');
  }

  deleteEvent(id: string): void {
    // Usamos una confirmación simple antes de proceder
    if (confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.')) {
      this.loading = true;
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          //his.notify.toast('Evento eliminado correctamente', 'success');
          this.loadEvents(); // Recargamos la lista para actualizar la tabla
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al eliminar:', err);
          //this.notify.toast('No se pudo eliminar el evento', 'error');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      //this.notify.toast('Completa los campos requeridos', 'warning');
      return;
    }

    this.loading = true;
    const data = this.eventForm.getRawValue() as Event;

    const request = data.id 
      ? this.eventService.updateEvent(data.id, data)
      : this.eventService.createEvent(data);

    request.subscribe({
      next: () => {
        //this.notify.toast(data.id ? 'Actualizado' : 'Creado');
        this.loadEvents();
        this.onCancel();
      },
      error: () => {
        this.loading = false;
        //this.notify.toast('Error al guardar', 'error');
      }
    });
  }

  onCancel(): void {
    this.eventForm.reset({ location: 'Tienda de Té', type: 'taller', isFree: true, requiresRegistration: true });
    this.loading = false;
  }

  private scrollTo(selector: string): void {
    setTimeout(() => {
      const el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => window.scrollBy(0, -this.NAVBAR_OFFSET), 300);
      }
    }, 100);
  }

  get paginatedEvents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEventList().slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredEventList().length / this.itemsPerPage) || 1;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollTo('.custom-table');
    }
  }
}