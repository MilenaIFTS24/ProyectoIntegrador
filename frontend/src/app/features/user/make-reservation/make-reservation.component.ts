import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { OfferService } from '../../../core/services/offer.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';
import { Offer } from '../../../core/models/offer.model';

@Component({
  selector: 'app-make-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './make-reservation.component.html',
  styleUrls: ['./make-reservation.component.css']
})
export class MakeReservationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private offerService = inject(OfferService);
  private reservationService = inject(ReservationService);
  private notify = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public products = signal<Product[]>([]);
  public offers = signal<Offer[]>([]);
  public loading = signal(false);
  public submitting = signal(false);
  public currentUser = this.authService.getCurrentUser();

  public appliedDiscount = signal(0);
  public discountLabel = signal('');

  public reservationForm = this.fb.group({
    contactEmail: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    paymentMethod: ['', Validators.required],
    pickupTimeSlot: ['', Validators.required],
    clientNotes: [''],
    items: this.fb.array([])
  });

  get itemsArray(): FormArray {
    return this.reservationForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    let email = this.currentUser?.email;
    if (!email) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          email = parsed.email;
        } catch (e) {
          console.warn('No se pudo parsear userData');
        }
      }
    }
    if (email) {
      this.reservationForm.patchValue({ contactEmail: email });
    }

    this.loadProducts();
    this.loadOffers();
    this.addItemRow();
  }

  // Cargar la lista de productos
  loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notify.toast('Error al cargar productos', 'error');
      }
    });
  }

  // Cargar la lista de ofertas
  loadOffers(): void {
    this.offerService.findAllOffersService().subscribe({
      next: (data) => {
        const activeOffers = data.filter(o => o.active === true);
        this.offers.set(activeOffers);
        this.calculateDiscount();
      },
      error: (err) => {
        this.offers.set([]);
      }
    });
  }

  // Agregar una fila de producto
  addItemRow(): void {
    const itemGroup = this.fb.group({
      productId: [null as string | null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      product: [null as Product | null]
    });
    this.itemsArray.push(itemGroup);
    this.calculateDiscount();
  }

  // Eliminar una fila de producto
  removeItemRow(index: number): void {
    if (this.itemsArray.length > 1) {
      this.itemsArray.removeAt(index);
      this.calculateDiscount();
    } else {
      this.notify.toast('Debe tener al menos un producto', 'warning');
    }
  }

  // Seleccionar un producto
  onProductSelect(index: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const productId = select.value;
    const product = this.products().find(p => p.id === productId);
    if (product) {
      const itemGroup = this.itemsArray.at(index) as any;
      itemGroup.patchValue({
        productId: product.id,
        product: product
      });
      this.validateQuantity(index);
      this.calculateDiscount();
    }
  }

  // Validar la cantidad de un producto
  validateQuantity(index: number): void {
    const itemGroup = this.itemsArray.at(index);
    const productId = itemGroup.get('productId')?.value;
    const quantity = itemGroup.get('quantity')?.value || 0;
    const product = this.products().find(p => p.id === productId);
    const stock = product?.stock ?? 0;

    if (quantity > stock) {
      itemGroup.get('quantity')?.setErrors({ exceedsStock: true });
    } else {
      const errors = itemGroup.get('quantity')?.errors;
      if (errors) {
        delete errors['exceedsStock'];
        if (Object.keys(errors).length === 0) {
          itemGroup.get('quantity')?.setErrors(null);
        }
      }
    }
  }

  // Actualizar la cantidad de un producto
  onQuantityChange(index: number): void {
    this.validateQuantity(index);
    this.calculateDiscount();
  }

  // Obtener el nombre de un producto
  getProductName(productId: string): string {
    const product = this.products().find(p => p.id === productId);
    return product ? product.name : 'Producto no disponible';
  }

  // Obtener el precio de un producto
  getProductPrice(productId: string): number {
    const product = this.products().find(p => p.id === productId);
    return product ? product.price : 0;
  }

  // Obtener el stock de un producto
  getProductStock(productId: string): number {
    const product = this.products().find(p => p.id === productId);
    return product?.stock ?? 0;
  }

  // Calcular el subtotal
  calculateSubtotal(): number {
    let subtotal = 0;
    for (const control of this.itemsArray.controls) {
      const productId = control.get('productId')?.value;
      const quantity = control.get('quantity')?.value || 0;
      const product = this.products().find(p => p.id === productId);
      if (product) {
        subtotal += product.price * quantity;
      }
    }
    return subtotal;
  }

  // Calcular el descuento
  calculateDiscount(): void {
    const subtotal = this.calculateSubtotal();
    if (subtotal === 0) {
      this.appliedDiscount.set(0);
      this.discountLabel.set('');
      return;
    }

    const productIds = this.itemsArray.controls
      .map(ctrl => ctrl.get('productId')?.value)
      .filter(id => id !== null && id !== undefined) as string[];

    if (productIds.length === 0) {
      this.appliedDiscount.set(0);
      this.discountLabel.set('');
      return;
    }

    const applicableOffers: Offer[] = [];
    for (const offer of this.offers()) {
      const offerProductIds = offer.Products?.map(p => p.id) || [];
      const applies = offerProductIds.length === 0 ||
        productIds.some(id => offerProductIds.includes(id));
      if (applies) {
        applicableOffers.push(offer);
      }
    }

    if (applicableOffers.length === 0) {
      this.appliedDiscount.set(0);
      this.discountLabel.set('');
      return;
    }

    let bestDiscount = 0;
    let bestLabel = '';
    for (const offer of applicableOffers) {
      let discountAmount = 0;
      if (offer.type === 'percentage') {
        discountAmount = (subtotal * offer.value) / 100;
      } else if (offer.type === 'fixed') {
        discountAmount = Math.min(offer.value, subtotal);
      } else if (offer.type === 'quantity') {
        continue;
      }
      if (discountAmount > bestDiscount) {
        bestDiscount = discountAmount;
        bestLabel = offer.title;
      }
    }

    this.appliedDiscount.set(bestDiscount);
    this.discountLabel.set(bestLabel);
  }

  // Enviar el formulario
  onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      this.notify.toast('Completa todos los campos obligatorios', 'warning');
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.notify.toast('Usuario no autenticado', 'error');
      return;
    }

    // Validar stock
    for (let i = 0; i < this.itemsArray.length; i++) {
      const itemGroup = this.itemsArray.at(i);
      const productId = itemGroup.get('productId')?.value;
      const quantity = itemGroup.get('quantity')?.value || 0;
      const product = this.products().find(p => p.id === productId);
      const stock = product?.stock ?? 0;
      if (quantity > stock) {
        this.notify.toast(`Stock insuficiente para ${product?.name || 'producto'}`, 'error');
        return;
      }
    }

    this.submitting.set(true);

    const formValue = this.reservationForm.getRawValue();
    const items = formValue.items?.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: this.getProductPrice(item.productId)
    })) || [];

    if (items.length === 0) {
      this.notify.toast('Debe agregar al menos un producto', 'warning');
      this.submitting.set(false);
      return;
    }

    const subtotal = this.calculateSubtotal();
    const discount = this.appliedDiscount();
    const totalAmount = subtotal - discount;

    const reservationData = {
      userId: userId,
      contactEmail: formValue.contactEmail,
      paymentMethod: formValue.paymentMethod,
      pickupDate: null,
      pickupTimeSlot: formValue.pickupTimeSlot,
      isEcoPackaging: true,
      clientNotes: formValue.clientNotes || '',
      subtotal: subtotal,
      discount: discount,
      totalAmount: totalAmount,
      items: items
    };

    this.reservationService.createReservation(reservationData).subscribe({
      next: () => {
        this.submitting.set(false);
        this.notify.toast('Reserva creada con éxito', 'success');
        this.router.navigate(['/userDashboard/userDashboardHome']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.notify.toast('Error al crear la reserva', 'error');
      }
    });
  }

  // Limpiar el formulario
  resetForm(): void {
    this.reservationForm.reset({
      paymentMethod: 'contado',
      pickupTimeSlot: '',
      clientNotes: ''
    });
    if (this.currentUser?.email) {
      this.reservationForm.patchValue({ contactEmail: this.currentUser.email });
    }
    this.itemsArray.clear();
    this.addItemRow();
    this.appliedDiscount.set(0);
    this.discountLabel.set('');
  }

  // Obtener la fecha mínima permitida
  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}