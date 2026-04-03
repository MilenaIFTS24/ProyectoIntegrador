import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);

  public products: Product[] = [];
  public loading: boolean = true;
  public errorMessage: string = '';
  public currentPage: number = 1;
  public itemsPerPage: number = 10;

  public productForm = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.maxLength(200)]],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    stock: [null as number | null, [Validators.min(0), Validators.required]],
    image: [''],
    productType: ['', Validators.required],

    // Atributos de Té
    brand: ['', [Validators.maxLength(50)]],
    type: [''],
    origin: [''],
    hasCaffeine: [false],
    isOrganic: [false],
    isFairTrade: [false],
    format: [''],
    weightPerUnit: [null as number | null, [Validators.min(0)]],

    // Atributos de Artesanía
    brandArtist: ['', [Validators.maxLength(50)]],
    category: [''],
    creationDate: [''],
    weight: [null as number | null, [Validators.min(0)]],
    isUnique: [false],
    materials: [''],
    ecoFriendly: [false]
  });

  ngOnInit(): void {
    this.loadProducts();

    this.productForm.get('productType')?.valueChanges.subscribe(val => {
      this.toggleFields(val);
    });

    this.toggleFields('');
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.toast('No se pudieron cargar los productos', 'error');
        this.errorMessage = 'Error de conexión con el servidor.';
      }
    });
  }

  toggleFields(type: string | null | undefined): void {
    const val = type ? type.toLowerCase().trim() : '';
    const esTe = val === 'tea' || val === 'té';
    const esArtesania = val === 'craft' || val === 'artesanía';

    const camposTe = ['brand', 'type', 'origin', 'format', 'weightPerUnit'];
    const camposArtesania = ['brandArtist', 'category', 'weight', 'materials'];

    [...camposTe, ...camposArtesania].forEach(name => {
      const control = this.productForm.get(name);
      control?.disable();
      control?.clearValidators();
    });

    if (esTe) {
      camposTe.forEach(name => {
        const control = this.productForm.get(name);
        control?.enable();
        if (name === 'origin') control?.setValidators([Validators.required]);
      });
    } else if (esArtesania) {
      camposArtesania.forEach(name => {
        const control = this.productForm.get(name);
        control?.enable();
        if (name === 'materials') control?.setValidators([Validators.required]);
      });
    }

    [...camposTe, ...camposArtesania].forEach(name => {
      this.productForm.get(name)?.updateValueAndValidity();
    });
  }

  updateProduct(product: Product) {
    this.productForm.reset();

    const apiToUiMap: Record<string, string> = { 'tea': 'tea', 'craft': 'craft' };
    const uiType = apiToUiMap[product.productType] || 'tea';

    this.toggleFields(uiType);

    let materialsText = '';
    if (product.materials && Array.isArray(product.materials)) {
      materialsText = product.materials.join(', ');
    } else {
      materialsText = (product.materials as any) || '';
    }

    this.productForm.patchValue({
      ...product,
      materials: materialsText
    } as any);

    this.productForm.get('productType')?.setValue(product.productType, { emitEvent: false });
    this.notify.toast(`Editando: ${product.name}`, 'info');

    // SCROLL AL FORMULARIO
    document.querySelector('.product-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onSubmit() {
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid) {
      this.notify.toast('Completa los campos obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const f = this.productForm.getRawValue();
    const isTea = f.productType === 'tea' || f.productType === 'té';

    const payload: Product = {
      id: f.id || undefined,
      name: f.name || '',
      price: f.price || 0,
      stock: f.stock || 0,
      description: f.description || '',
      image: f.image || '',
      productType: isTea ? 'tea' : 'craft'
    };

    if (isTea) {
      payload.brand = f.brand || '';
      payload.origin = f.origin || '';
      payload.type = f.type || '';
      payload.format = f.format || '';
      payload.weightPerUnit = f.weightPerUnit || 0;
      payload.hasCaffeine = !!f.hasCaffeine;
      payload.isOrganic = !!f.isOrganic;
      payload.isFairTrade = !!f.isFairTrade;
    } else {
      payload.brandArtist = f.brandArtist || '';
      payload.category = f.category || '';
      payload.weight = f.weight || 0;
      payload.isUnique = !!f.isUnique;
      payload.ecoFriendly = !!f.ecoFriendly;
      payload.materials = f.materials ? f.materials.split(',').map(m => m.trim()) : [];
    }

    this.productService.saveProduct(payload).subscribe({
      next: () => {
        this.notify.toast(f.id ? 'Actualizado con éxito' : 'Creado con éxito');
        this.loadProducts();
        this.onCancel();
        // SCROLL A LA TABLA
        document.querySelector('.custom-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      error: () => {
        this.loading = false;
        this.notify.toast('Error al guardar el producto', 'error');
      }
    });
  }

  deleteProduct(product: Product) {
    this.notify.confirm('¿Estás seguro?', `Vas a eliminar "${product.name}"`).then(result => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(product.id!).subscribe({
          next: () => {
            this.notify.toast('Producto eliminado');
            this.loadProducts();
          },
          error: (err) => this.notify.toast(err.message, 'error')
        });
      }
    });
  }

  onCancel() {
    this.productForm.reset({
      id: null,
      name: '',
      productType: '',
      price: null,
      stock: null,
      hasCaffeine: false,
      isOrganic: false,
      isFairTrade: false,
      isUnique: false,
      ecoFriendly: false
    });
    this.toggleFields('');
    this.productForm.markAsPristine();
    this.productForm.markAsUntouched();
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage) || 1;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}