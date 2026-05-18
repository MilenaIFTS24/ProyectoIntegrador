import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
//import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent implements OnInit {
  private eventService = inject(EventService);
  private fb = inject(FormBuilder);
  //private notify = inject(NotificationService);

  // Estados
  public events: Event[] = [];
  public filteredEventList: Event[] = [];
  public loading: boolean = true;
  public errorMessage: string = '';
  
  // Paginación y UI
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  private readonly NAVBAR_OFFSET = 110;

  // Formulario Reactivo
  public eventForm = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    date: ['', Validators.required],
    time: ['', Validators.required],
    location: ['Tienda de Té', Validators.required],
    maxCapacity: [null as number | null, [Validators.required, Validators.min(1)]],
    requiresRegistration: [true],
    type: ['taller', Validators.required],
    status: ['programado', Validators.required],
    imageUrl: ['']
  });

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
        this.filteredEventList = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        //this.notify.toast('No se pudieron cargar los eventos', 'error');
        this.errorMessage = 'Error de conexión con el servidor.';
      }
    });
  }

  filterResults(text: string): void {
    text = text.trim().toLowerCase();
    if (!text) {
      this.filteredEventList = this.events;
    } else {
      this.filteredEventList = this.events.filter(
        event => event.name.toLowerCase().includes(text) || 
                 event.type.toLowerCase().includes(text)
      );
    }
    this.currentPage = 1;
  }

  updateEvent(event: Event) {
    this.eventForm.reset();
    
    // Cargamos los datos en el formulario
    this.eventForm.patchValue({
      ...event
    } as any);

    //this.notify.toast(`Editando: ${event.name}`, 'info');
    this.scrollTo('.event-card'); // Ajusta el selector según tu HTML
  }

  onSubmit() {
    this.eventForm.markAllAsTouched();

    if (this.eventForm.invalid) {
      //this.notify.toast('Completa los campos obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const formValue = this.eventForm.getRawValue();

    const payload: Event = {
      ...(formValue as Event),
      id: formValue.id || undefined
    };

    const request = payload.id 
      ? this.eventService.updateEvent(payload.id, payload)
      : this.eventService.createEvent(payload);

    request.subscribe({
      next: () => {
        //this.notify.toast(payload.id ? 'Evento actualizado' : 'Evento creado');
        this.loadEvents();
        this.onCancel();
        this.scrollTo('.custom-table');
      },
      error: () => {
        this.loading = false;
        //this.notify.toast('Error al guardar el evento', 'error');
      }
    });
  }

  // deleteEvent(event: Event) {
  //   this.notify.confirm('¿Eliminar evento?', `Vas a eliminar "${event.name}". Esta acción no se puede deshacer.`).then(result => {
  //     if (result.isConfirmed) {
  //       this.eventService.deleteEvent(event.id!).subscribe({
  //         next: () => {
  //           this.notify.toast('Evento eliminado');
  //           this.loadEvents();
  //         },
  //         error: (err) => this.notify.toast(err.message, 'error')
  //       });
  //     }
  //   });
  // }

  onCancel() {
    this.eventForm.reset({
      location: 'Tienda de Té',
      requiresRegistration: true,
      type: 'taller',
      status: 'programado'
    });
    this.eventForm.markAsPristine();
    this.eventForm.markAsUntouched();
    this.loading = false;
  }

  // Helpers de UI (Paginación y Scroll)
  get paginatedEvents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEventList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEventList.length / this.itemsPerPage) || 1;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollTo('.custom-table');
    }
  }

  private scrollTo(selector: string): void {
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => window.scrollBy(0, -this.NAVBAR_OFFSET), 300);
      }
    }, 100);
  }
}