import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OfferService } from '../../../core/services/offer.service';
import { ProductService } from '../../../core/services/product.service';
import { Offer } from '../../../core/models/offer.model';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-manage-offers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.css']
})
export class ManageOffersComponent implements OnInit {
  private offerService = inject(OfferService);
  private productsService = inject(ProductService);
  private fb = inject(FormBuilder);

  public offers: Offer[] = [];
  public filteredOfferList: Offer[] = [];
  public availableProducts: Product[] = [];
  public loading: boolean = true;
  public errorMessage: string = '';
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  private readonly NAVBAR_OFFSET = 110;

  // Lista auxiliar para guardar los IDs de los checkboxes seleccionados
  public selectedProductIds: number[] = [];

  // Formulario Reactivo adaptado
  public offerForm = this.fb.group({
    id: [null as string | null],
    title: ['', [Validators.required, Validators.minLength(3)]],
    type: ['percentage' as const, Validators.required],
    value: [0, [Validators.required, Validators.min(0)]],
    active: [true]
  });

  get selectedOfferType(): string {
    return this.offerForm.get('type')?.value || 'percentage';
  }

  ngOnInit(): void {
    this.loadOffers();
    this.loadProducts();
  }

  loadOffers(): void {
    this.loading = true;
    this.offerService.findAllOffersService().subscribe({
      next: (data: Offer[]) => {
        this.offers = data;
        this.filteredOfferList = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error de conexión con el servidor.';
      }
    });
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.availableProducts = data;
      },
      error: (err) => {
        console.error('Error al cargar la lista de productos:', err);
      }
    });
  }

  filterResults(text: string): void {
    const term = text.trim().toLowerCase();
    this.filteredOfferList = this.offers.filter(offer =>
      offer.title.toLowerCase().includes(term) ||
      offer.type.toLowerCase().includes(term) ||
      offer.id?.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  updateOffer(offer: Offer): void {
    this.offerForm.reset();

    this.offerForm.patchValue({
      id: offer.id,
      title: offer.title,
      type: offer.type,
      value: offer.value,
      active: offer.active
    } as any);

    // Mapeamos los productos vinculados de la oferta seleccionada
    if (offer.Products) {
      this.selectedProductIds = offer.Products.map(p => p.id!);
    } else {
      this.selectedProductIds = [];
    }

    this.scrollTo('.event-card');
  }

  onProductSelect(event: any, productId: number): void {
    if (event.target.checked) {
      this.selectedProductIds.push(productId);
    } else {
      this.selectedProductIds = this.selectedProductIds.filter(id => id !== productId);
    }
  }

  isProductSelected(productId: number): boolean {
    return this.selectedProductIds.includes(productId);
  }

  onSubmit(): void {
    this.offerForm.markAllAsTouched();
    if (this.offerForm.invalid) return;

    const f = this.offerForm.getRawValue();
    this.loading = true;

    // Payload que unifica los campos de la oferta y los IDs para la tabla intermedia
    const payload: any = {
      title: f.title || '',
      type: f.type!,
      value: f.value || 0,
      active: !!f.active,
      productIds: this.selectedProductIds
    };

    if (f.id) {
      // Modo edición: Pasamos el id dentro del objeto oferta tal como requiere updateOfferService
      payload.id = f.id;

      this.offerService.updateOfferService(payload as Offer).subscribe({
        next: () => {
          this.loadOffers();
          this.onCancel();
          this.scrollTo('.custom-table');
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al actualizar la oferta:', err);
          this.errorMessage = 'Error al actualizar la oferta.';
        }
      });
    } else {
      // Modo creación: El servicio espera Omit<Offer, 'id'>, por ende enviamos el payload sin el campo 'id'
      this.offerService.createOfferService(payload).subscribe({
        next: () => {
          this.loadOffers();
          this.onCancel();
          this.scrollTo('.custom-table');
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al crear la oferta:', err);
          this.errorMessage = 'Error al crear la oferta.';
        }
      });
    }
  }

  deleteOffer(offer: Offer): void {
    if (confirm(`¿Estás seguro de eliminar la oferta "${offer.title}"?`)) {
      this.offerService.deleteOfferService(offer.id!).subscribe({
        next: () => {
          this.loadOffers();
        },
        error: (err) => {
          console.error('Error al eliminar la oferta:', err);
          this.errorMessage = 'No se pudo eliminar la oferta.';
        }
      });
    }
  }

  onCancel(): void {
    this.offerForm.reset({
      id: null,
      title: '',
      type: 'percentage',
      value: 0,
      active: true
    });

    this.selectedProductIds = [];
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

  get paginatedOffers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOfferList.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOfferList.length / this.itemsPerPage) || 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollTo('.custom-table');
    }
  }
}