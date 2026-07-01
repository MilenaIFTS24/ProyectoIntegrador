import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models/reservation.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-manage-reservations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, CurrencyPipe],
  templateUrl: './manage-reservations.component.html',
  styleUrls: ['./manage-reservations.component.css']
})
export class ManageReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);

  public reservations: Reservation[] = [];
  public filteredReservationList: Reservation[] = [];
  public loading: boolean = true;
  public errorMessage: string = '';
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  private readonly NAVBAR_OFFSET = 110;
  public minDate: string = '';

  public selectedItems = signal<any[]>([]);

  public reservationForm = this.fb.group({
    id: [null as string | null],
    contactEmail: [{ value: '', disabled: true }, Validators.required],
    paymentMethod: [{ value: '', disabled: true }, Validators.required],
    totalAmount: [{ value: 0, disabled: true }, Validators.required],
    subtotal: [{ value: 0, disabled: true }, Validators.required],
    discount: [{ value: 0, disabled: true }],
    clientNotes: [{ value: '', disabled: true }],
    pickupTimeSlot: [{ value: '', disabled: true }, Validators.required],
    status: ['', Validators.required],
    isEcoPackaging: [false],
    pickupDate: ['']
  });

  ngOnInit(): void {
    this.loadReservations();
    this.calculateMinDate();

    this.reservationForm.get('status')?.valueChanges.subscribe((status) => {
      const pickupDateControl = this.reservationForm.get('pickupDate');
      if (status === 'cancelada') {
        pickupDateControl?.disable();
        pickupDateControl?.setValue(''); // Limpia la fecha
      } else {
        pickupDateControl?.enable();
      }
      this.reservationForm.updateValueAndValidity();
    });
  }

  // Calcula la fecha mínima permitida
  private calculateMinDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }

  // Cargar las reservas
  loadReservations(): void {
    this.loading = true;
    this.reservationService.getAll().subscribe({
      next: (data: Reservation[]) => {
        this.reservations = data;
        this.filteredReservationList = data;
        this.loading = false;
        this.selectedItems.set([]);
      },
      error: () => {
        this.loading = false;
        this.notify.toast('No se pudieron cargar las reservas', 'error');
        this.errorMessage = 'Error de conexión con el servidor.';
      }
    });
  }

  // Filtrar las reservas
  filterResults(text: string): void {
    const term = text.trim().toLowerCase();
    this.filteredReservationList = this.reservations.filter(res =>
      res.contactEmail.toLowerCase().includes(term) ||
      res.id?.toLowerCase().includes(term) ||
      res.status.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  // Actualizar una reserva
  updateReservation(reservation: Reservation): void {
    this.reservationForm.reset();

    this.reservationForm.get('pickupDate')?.enable();

    this.reservationForm.patchValue({
      ...reservation,
      pickupDate: reservation.pickupDate ? new Date(reservation.pickupDate).toISOString().split('T')[0] : ''
    } as any);

    const status = this.reservationForm.get('status')?.value;
    if (status === 'cancelada') {
      this.reservationForm.get('pickupDate')?.disable();
    }

    this.selectedItems.set(reservation.items || []);
    this.notify.toast(`Editando reserva de: ${reservation.contactEmail}`, 'info');
    this.scrollTo('.reservation-card');
  }

  // Enviar el formulario
  onSubmit(): void {
    const status = this.reservationForm.get('status')?.value;
    const pickupDate = this.reservationForm.get('pickupDate')?.value;

    if (status !== 'cancelada' && !pickupDate) {
      this.notify.toast('La fecha de retiro es obligatoria para reservas no canceladas', 'warning');
      this.reservationForm.get('pickupDate')?.markAsTouched();
      return;
    }

    if (status !== 'cancelada' && pickupDate) {
      const selectedDate = new Date(pickupDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        this.notify.toast('La fecha no puede ser anterior a hoy', 'warning');
        return;
      }
    }

    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      this.notify.toast('Completa los campos obligatorios', 'warning');
      return;
    }

    const f = this.reservationForm.getRawValue();
    this.loading = true;

    const payload: Partial<Reservation> = {
      status: (f.status as any) || undefined,
      pickupDate: f.pickupDate ? f.pickupDate : null,
      isEcoPackaging: !!f.isEcoPackaging
    };

    if (f.id) {
      this.reservationService.updateReservation(f.id, payload).subscribe({
        next: () => {
          this.notify.toast('Reserva actualizada con éxito', 'success');
          this.loadReservations();
          this.onCancel();
          this.scrollTo('.custom-table');
        },
        error: (err) => {
          this.loading = false;
          this.notify.toast('Error al actualizar la reserva', 'error');
        }
      });
    }
  }

  // Actualizar el estado de una reserva
  quickStatusChange(reservation: Reservation, newStatus: any): void {
    this.reservationService.updateStatus(reservation.id!, newStatus).subscribe(() => {
      this.loadReservations();
    });
  }

  // Cancelar la creacion o modificacion de una reserva
  onCancel(): void {
    this.reservationForm.reset({
      id: null,
      contactEmail: '',
      paymentMethod: '',
      totalAmount: 0,
      subtotal: 0,
      discount: 0,
      clientNotes: '',
      pickupTimeSlot: '',
      status: '',
      pickupDate: '',
      isEcoPackaging: false
    });

    this.reservationForm.get('pickupDate')?.enable();
    this.selectedItems.set([]);
    this.loading = false;
    this.errorMessage = '';
  }

  // Eliminar una reserva
  deleteReservation(reservation: Reservation): void {
    if (!reservation.id) {
      this.notify.toast('No se pudo identificar la reserva', 'error');
      return;
    }

    this.notify.confirm(
      '¿Eliminar reserva?',
      `Estás por eliminar la reserva de ${reservation.contactEmail}. Esta acción no se puede deshacer.`
    ).then(result => {
      if (result.isConfirmed) {
        this.loading = true;
        this.reservationService.deleteReservation(reservation.id!).subscribe({
          next: () => {
            this.notify.toast('Reserva eliminada correctamente', 'success');
            this.loadReservations();
            this.onCancel(); 
          },
          error: (err) => {
            this.loading = false;
            this.notify.toast(err.message || 'Error al eliminar la reserva', 'error');
          }
        });
      }
    });
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

  // --- Paginación ---
  get paginatedReservations() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReservationList.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReservationList.length / this.itemsPerPage) || 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollTo('.custom-table');
    }
  }
}