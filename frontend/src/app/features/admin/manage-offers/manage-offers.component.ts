import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OfferService } from '../../../core/services/offer.service';
import { ProductService } from '../../../core/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Offer } from '../../../core/models/offer.model';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-manage-offers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.css']
})
export class ManageOffersComponent implements OnInit {
  private offerService = inject(OfferService);
  private productsService = inject(ProductService);
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);

  public offers: Offer[] = [];
  public filteredOfferList: Offer[] = [];
  public availableProducts: Product[] = [];
  public loading: boolean = true;
  public errorMessage: string = '';
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  private readonly NAVBAR_OFFSET = 110;

  public selectedProductIds: any[] = [];

  public offerForm = this.fb.group({
    id: [null as string | null],
    title: [null as string | null, [Validators.required, Validators.minLength(3)]],
    type: ['' as unknown as any, Validators.required],
    value: [null as number | null, [Validators.required, Validators.min(1)]],
    active: [true]
  });

  // Obtener el tipo de oferta seleccionado
  get selectedOfferType(): string {
    return this.offerForm.get('type')?.value || 'percentage';
  }

  // Validar si un campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    const field = this.offerForm.get(fieldName);
    if (!field) return false;

    const value = field.value;
    const isEmpty = value === null || value === undefined || value.toString().trim() === '';

    return field.touched && isEmpty;
  }

  ngOnInit(): void {
    this.loadOffers();
    this.loadProducts();
  }

  // Cargar la lista de ofertas
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
        this.notify.toast('Error al cargar la lista de ofertas', 'error');
      }
    });
  }

  // Cargar la lista de productos
  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.availableProducts = data;
      },
      error: (err) => {
        console.error('Error al cargar la lista de productos:', err);
        this.notify.toast('No se pudieron sincronizar los productos disponibles', 'error');
      }
    });
  }

  // Filtrar las ofertas
  filterResults(text: string): void {
    const term = text.trim().toLowerCase();
    this.filteredOfferList = this.offers.filter(offer =>
      offer.title.toLowerCase().includes(term) ||
      offer.type.toLowerCase().includes(term) ||
      offer.id?.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  // Actualizar una oferta
  updateOffer(offer: Offer): void {
    this.offerForm.reset();

    this.offerForm.patchValue({
      id: offer.id,
      title: offer.title,
      type: offer.type,
      value: offer.value,
      active: offer.active
    } as any);

    const associatedProducts = offer.Products || (offer as any).products || [];

    if (associatedProducts && Array.isArray(associatedProducts) && associatedProducts.length > 0) {
      this.selectedProductIds = associatedProducts
        .filter(p => p && p.id !== undefined && p.id !== null)
        .map(p => p.id.toString().trim());
    } else {
      this.selectedProductIds = [];
    }

    this.notify.toast(`Editando oferta: ${offer.title}`, 'info');
    this.scrollTo('.event-card');
  }

  // Seleccionar un producto
  onProductSelect(event: any, productId: any): void {
    const incomingId = productId.toString().trim();

    if (event.target.checked) {
      const exists = this.selectedProductIds.some(id => id.toString().trim() === incomingId);
      if (!exists) {
        this.selectedProductIds.push(productId);
      }
    } else {
      this.selectedProductIds = this.selectedProductIds.filter(
        id => id.toString().trim() !== incomingId
      );
    }
  }

  // Verificar si un producto esta seleccionado
  isProductSelected(productId: any): boolean {
    if (productId === undefined || productId === null || this.selectedProductIds.length === 0) {
      return false;
    }
    return this.selectedProductIds
      .map(id => id.toString().trim())
      .includes(productId.toString().trim());
  }

  // Enviar el formulario
  onSubmit(): void {
    this.offerForm.markAllAsTouched();
    if (this.offerForm.invalid) return;

    const f = this.offerForm.getRawValue();
    this.loading = true;

    const payload: any = {
      title: f.title || '',
      type: f.type!,
      value: f.value || 0,
      active: !!f.active,
      productIds: this.selectedProductIds
    };

    if (f.id) {
      payload.id = f.id;

      this.offerService.updateOfferService(payload as Offer).subscribe({
        next: () => {
          this.loadOffers();
          this.onCancel();
          this.scrollTo('.custom-table');
          this.notify.toast('Oferta actualizada con éxito', 'success');
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Error al actualizar la oferta.';
          this.notify.toast('Error al intentar guardar los cambios de la oferta', 'error');
        }
      });
    } else {
      this.offerService.createOfferService(payload).subscribe({
        next: () => {
          this.loadOffers();
          this.onCancel();
          this.scrollTo('.custom-table');
          this.notify.toast('Nueva oferta creada de forma exitosa', 'success');
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Error al crear la oferta.';
          this.notify.toast('No se pudo dar de alta la oferta en el sistema', 'error');
        }
      });
    }
  }

  // Eliminar una oferta
  deleteOffer(offer: Offer): void {
    this.notify.confirm(
      '¿Estás seguro?',
      `Vas a eliminar la oferta "${offer.title}"`
    ).then(result => {
      if (result.isConfirmed) {
        this.offerService.deleteOfferService(offer.id!).subscribe({
          next: () => {

            const currentIdInForm = this.offerForm.get('id')?.value;
            if (currentIdInForm === offer.id) {
              this.onCancel();
            }
            this.notify.toast('Oferta eliminada');
            this.loadOffers();
          },
          error: (err) => {
            console.error('Error al eliminar la oferta:', err);
            this.notify.toast(err.message || 'Error al intentar borrar la oferta', 'error');
          }
        });
      }
    });
  }

  // Cancelar la creacion o modificacion de una oferta
  onCancel(): void {
    this.offerForm.reset({
      id: null,
      title: null,
      type: 'percentage',
      value: null,
      active: true
    });

    this.selectedProductIds = [];
    this.loading = false;
    this.errorMessage = '';
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