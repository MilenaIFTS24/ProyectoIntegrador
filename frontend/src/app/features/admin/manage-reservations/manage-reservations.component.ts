import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models/reservation.model';
// import { NotificationService } from '../../../core/services/notification.service';

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
  // private notify = inject(NotificationService);

  public reservations: Reservation[] = [];
  public filteredReservationList: Reservation[] = [];
  public loading: boolean = true;
  public errorMessage: string = '';
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  private readonly NAVBAR_OFFSET = 110;
  public minDate: string = '';

  // Formulario: Solo 'status' y 'pickupDate' son editables
  public reservationForm = this.fb.group({
    id: [null as string | null],
    contactEmail: [{ value: '', disabled: true }],
    paymentMethod: [{ value: '', disabled: true }],
    totalAmount: [{ value: 0, disabled: true }],
    subtotal: [{ value: 0, disabled: true }],
    discount: [{ value: 0, disabled: true }],
    clientNotes: [{ value: '', disabled: true }],
    pickupTimeSlot: [{ value: '', disabled: true }],

    // Campos que el Admin SI puede modificar
    status: ['pendiente', Validators.required],
    isEcoPackaging: [false],
    pickupDate: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadReservations();
    this.calculateMinDate();
  }

  private calculateMinDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    this.minDate = `${year}-${month}-${day}`;
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getAll().subscribe({
      next: (data: Reservation[]) => {
        this.reservations = data;
        this.filteredReservationList = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error de conexión con el servidor.';
        // this.notify.toast('Error al cargar reservas', 'error');
      }
    });
  }

  filterResults(text: string): void {
    const term = text.trim().toLowerCase();
    this.filteredReservationList = this.reservations.filter(res =>
      res.contactEmail.toLowerCase().includes(term) ||
      res.id?.toLowerCase().includes(term) ||
      res.status.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  updateReservation(reservation: Reservation): void {
    this.reservationForm.reset();

    this.reservationForm.patchValue({
      ...reservation,
      pickupDate: reservation.pickupDate ? new Date(reservation.pickupDate).toISOString().split('T')[0] : ''
    } as any);

    // this.notify.toast(`Consultando reserva de: ${reservation.contactEmail}`, 'info');
    this.scrollTo('.reservation-card');
  }

  onSubmit(): void {
    this.reservationForm.markAllAsTouched();
    if (this.reservationForm.invalid) return;

    const f = this.reservationForm.getRawValue();

    const selectedDate = new Date(f.pickupDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      console.warn('La fecha de retiro no puede ser anterior a hoy');
      return;
    }

    this.loading = true;

    const payload: Partial<Reservation> = {
      status: (f.status as any) || undefined,
      pickupDate: f.pickupDate || undefined,
      isEcoPackaging: !!f.isEcoPackaging
    };

    if (f.id) {
      this.reservationService.updateReservation(f.id, payload).subscribe({
        next: () => {
          this.loadReservations(); 
          this.onCancel();        
          this.scrollTo('.custom-table');
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al actualizar:', err);
        }
      });
    }
  }

  quickStatusChange(reservation: Reservation, newStatus: any): void {
    this.reservationService.updateStatus(reservation.id!, newStatus).subscribe(() => {
      this.loadReservations();
      // this.notify.toast(`Estado: ${newStatus}`);
    });
  }

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
      status: 'pendiente',
      pickupDate: '',
      isEcoPackaging: false
    });

    this.loading = false;
    this.errorMessage = '';
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