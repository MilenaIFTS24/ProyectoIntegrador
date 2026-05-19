import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { Event as CalendarEvent } from '../../../core/models/event.model'; // Alias para evitar conflicto con el DOM
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

  // Signals con el tipo correcto del alias
  public events = signal<CalendarEvent[]>([]);
  public filteredEventList = signal<CalendarEvent[]>([]);

  public loading = true;
  public errorMessage = '';
  public currentPage = 1;
  public itemsPerPage = 5;
  private readonly NAVBAR_OFFSET = 110;

  // Formulario con campos opcionales y valores por defecto
  public eventForm = this.fb.group({
    id: [null as string | null],
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required]],
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: [null as string | null],
    location: ['Tienda de Té'],
    type: ['taller', Validators.required],
    maxCapacity: [10, [Validators.min(0)]],
    requiresRegistration: [true],
    isFree: [true],
    price: [0],
    organizerContact: [''],
    isVirtual: [false],
    ecoFocus: [''],
    materials: [''],
    isCancelledByRain: [false]
  });

  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadEvents();
    this.setupFormListeners();
    this.checkInitialStates();
  }

  private checkInitialStates(): void {
    // Verificación inicial para campos que deben nacer bloqueados
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

  private setupFormListeners(): void {
    // Listener: Gratuidad -> Precio
    this.eventForm.get('isFree')?.valueChanges.subscribe((isFree: boolean | null) => {
      const priceControl = this.eventForm.get('price');
      if (isFree) {
        priceControl?.setValue(0);
        priceControl?.disable();
      } else {
        priceControl?.enable();
      }
    });

    // Listener: Virtualidad -> Ubicación
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

    // Listener: Inscripción -> Cupo (0 = LIBRE)
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

  updateEvent(event: CalendarEvent): void {
    this.eventForm.reset();

    // Habilitar temporalmente para que patchValue escriba los datos
    this.eventForm.get('price')?.enable();
    this.eventForm.get('location')?.enable();
    this.eventForm.get('maxCapacity')?.enable();

    this.eventForm.patchValue({ ...event } as any);

    // Re-aplicar bloqueos según los datos del evento cargado
    this.checkInitialStates();

    this.notify.toast(`Editando: ${event.title}`, 'info');
    this.scrollTo('.event-card');
  }

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
    },
    error: (err) => {
      this.loading = false;
      console.error('Error del servidor:', err);
      this.notify.toast('Error al procesar la solicitud', 'error');
    }
  });
}
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
  
  // Re-aplicamos los estados de habilitación iniciales
  this.eventForm.get('price')?.disable();
  this.eventForm.get('location')?.enable();
  this.eventForm.get('maxCapacity')?.enable();
  
  this.loading = false;
}

  // --- Helpers Visuales ---
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