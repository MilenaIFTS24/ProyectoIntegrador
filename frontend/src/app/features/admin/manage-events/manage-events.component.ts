import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { Event as CalendarEvent } from '../../../core/models/event.model';
import { NotificationService } from '../../../core/services/notification.service';

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
  private notify = inject(NotificationService);

  public events = signal<CalendarEvent[]>([]);
  public filteredEventList = signal<CalendarEvent[]>([]);

  public loading = true;
  public errorMessage = '';
  public currentPage = 1;
  public itemsPerPage = 5;
  private readonly NAVBAR_OFFSET = 110;

  public eventForm = this.fb.group({
    id: [null as string | null],
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: [null as string | null],
    location: ['Tienda de Té', Validators.required],
    type: ['', Validators.required],
    maxCapacity: [10, [Validators.min(0), Validators.required]],
    requiresRegistration: [true],
    isFree: [true],
    price: [0, Validators.required],
    organizerContact: [''],
    isVirtual: [false],
    ecoFocus: [''],
    materials: [''],
    isCancelledByRain: [false]
  });

  // Obtener la fecha mínima permitida
  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadEvents();
    this.setupFormListeners();
    this.checkInitialStates();
  }

  // Verificar el estado inicial de los controles
  private checkInitialStates(): void {
    if (this.eventForm.get('isFree')?.value) {
      this.eventForm.get('price')?.disable();
    }
    if (this.eventForm.get('isVirtual')?.value) {
      this.eventForm.get('location')?.disable();
    }
    if (!this.eventForm.get('requiresRegistration')?.value) {
      this.eventForm.get('maxCapacity')?.disable();
    }
  }

  // Configurar los listeners de los controles
  private setupFormListeners(): void {
    this.eventForm.get('isFree')?.valueChanges.subscribe((isFree: boolean | null) => {
      const priceControl = this.eventForm.get('price');
      if (isFree) {
        priceControl?.setValue(0);
        priceControl?.disable();
      } else {
        priceControl?.enable();
      }
    });

    this.eventForm.get('isVirtual')?.valueChanges.subscribe((isVirtual: boolean | null) => {
      const locationControl = this.eventForm.get('location');
      if (isVirtual) {
        locationControl?.setValue('Virtual / Online');
        locationControl?.disable();
      } else {
        locationControl?.enable();
        locationControl?.setValue('Tienda de Té');
      }
    });

    this.eventForm.get('requiresRegistration')?.valueChanges.subscribe((requires: boolean | null) => {
      const maxCapacityControl = this.eventForm.get('maxCapacity');
      if (!requires) {
        maxCapacityControl?.setValue(0);
        maxCapacityControl?.disable();
      } else {
        maxCapacityControl?.enable();
        if (maxCapacityControl?.value === 0) maxCapacityControl?.setValue(10);
      }
    });
  }

  // Cargar los eventos
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
        this.notify.toast('Error al cargar eventos', 'error');
      }
    });
  }

  // Filtrar los eventos
  filterResults(text: string): void {
    const term = text.toLowerCase().trim();
    this.filteredEventList.set(
      this.events().filter(e =>
        e.title.toLowerCase().includes(term) ||
        e.type.toLowerCase().includes(term)
      )
    );
    this.currentPage = 1;
  }

  // Actualizar un evento
  updateEvent(event: CalendarEvent): void {
    this.eventForm.reset();

    this.eventForm.get('price')?.enable();
    this.eventForm.get('location')?.enable();
    this.eventForm.get('maxCapacity')?.enable();

    this.eventForm.patchValue({ ...event } as any);

    this.checkInitialStates();

    this.notify.toast(`Editando: ${event.title}`, 'info');
    this.scrollTo('.event-card');
  }

  // Eliminar un evento
  deleteEvent(event: CalendarEvent): void {
    if (!event || !event.id) {
      this.notify.toast('No se pudo identificar el evento', 'error');
      return;
    }

    this.notify.confirm(
      '¿Estás seguro?',
      `Vas a eliminar el evento "${event.title}"`
    ).then(result => {
      if (result.isConfirmed) {
        this.loading = true;
        this.eventService.deleteEvent(event.id!).subscribe({
          next: () => {
            this.notify.toast('Evento eliminado');
            this.loadEvents();
          },
          error: (err) => {
            this.loading = false;
            this.notify.toast(err.message || 'Error al eliminar', 'error');
          }
        });
      }
    });
  }

  // Enviar el formulario
  onSubmit(): void {
    if (this.eventForm.invalid) return;

    this.loading = true;

    const rawData = this.eventForm.getRawValue();

    const data: any = {
      ...rawData,
      price: rawData.isFree ? 0 : Number(rawData.price),
      maxCapacity: rawData.requiresRegistration ? Number(rawData.maxCapacity) : null
    };

    const nullableFields = [
      'endTime',
      'organizerContact',
      'promoImage',
      'ecoFocus',
      'materials',
      'maxCapacity'
    ];

    nullableFields.forEach(field => {
      if (data[field] === '' || data[field] === undefined) {
        data[field] = null;
      }
    });

    if (!data.id) {
      delete data.id;
    }

    const request = data.id
      ? this.eventService.updateEvent(data.id, data)
      : this.eventService.createEvent(data);

    request.subscribe({
      next: () => {
        this.notify.toast(data.id ? 'Evento actualizado' : 'Evento creado');
        this.loadEvents();
        this.onCancel();
        this.scrollTo('.custom-table');
      },
      error: (err) => {
        this.loading = false;
        console.error('Error del servidor:', err);
        this.notify.toast('Error al procesar la solicitud', 'error');
      }
    });
  }

  // Cancelar la creacion o modificacion de un evento
  onCancel(): void {
    this.eventForm.reset({
      location: 'Tienda de Té',
      type: 'taller',
      isFree: true,
      requiresRegistration: true,
      isVirtual: false,
      price: 0,
      maxCapacity: 10,
      isCancelledByRain: false
    });

    this.eventForm.get('price')?.disable();
    this.eventForm.get('location')?.enable();
    this.eventForm.get('maxCapacity')?.enable();

    this.loading = false;
  }

  // Desplazarse a un elemento
  private scrollTo(selector: string): void {
    setTimeout(() => {
      const el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => window.scrollBy(0, -this.NAVBAR_OFFSET), 300);
      }
    }, 100);
  }

  // --- Paginacion ---
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