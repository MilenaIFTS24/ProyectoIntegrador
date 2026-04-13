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
  public maxDate: string = '';
  public errorMessage: string = '';
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  private readonly NAVBAR_OFFSET = 110;

  public productForm = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.maxLength(200)]],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    stock: [null as number | null, [Validators.min(0), Validators.required]],
    image: [''],
    productType: ['', Validators.required],

    // Atributos de Té (Se eliminó 'type')
    brand: ['', [Validators.maxLength(50)]],
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
    this.setupUniqueProductListener();
    this.calculateMaxDate();
  }

  private calculateMaxDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    
    this.maxDate = `${year}-${month}-${day}`;
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

  private setupUniqueProductListener(): void {
    this.productForm.get('isUnique')?.valueChanges.subscribe((isUnique: boolean | null) => {
      const stockControl = this.productForm.get('stock');
      if (!!isUnique) {
        this.productForm.patchValue({ stock: 1 });
        stockControl?.disable();
      } else {
        stockControl?.enable();
      }
    });
  }

  toggleFields(type: string | null | undefined): void {
    const val = type ? type.toLowerCase().trim() : '';
    const esTe = val === 'tea' || val === 'té';
    const esArtesania = val === 'craft' || val === 'artesanía';

    const camposTe = ['brand', 'origin', 'format', 'weightPerUnit'];
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
    this.productForm.get('stock')?.enable();

    const apiToUiMap: Record<string, string> = { 'tea': 'tea', 'craft': 'craft' };
    const uiType = apiToUiMap[product.productType] || 'tea';

    this.toggleFields(uiType);

    let materialsText = product.materials && Array.isArray(product.materials)
      ? product.materials.join(', ')
      : (product.materials as any) || '';

    this.productForm.patchValue({
      ...product,
      materials: materialsText
    } as any);

    this.productForm.get('productType')?.setValue(product.productType, { emitEvent: false });

    if (product.isUnique) {
      this.productForm.get('stock')?.disable();
    }

    this.notify.toast(`Editando: ${product.name}`, 'info');
    this.scrollTo('.product-card');
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
      payload.creationDate = f.creationDate || '';
      payload.materials = f.materials ? f.materials.split(',').map(m => m.trim()) : [];
    }

    this.productService.saveProduct(payload).subscribe({
      next: () => {
        this.notify.toast(f.id ? 'Actualizado con éxito' : 'Creado con éxito');
        this.loadProducts();
        this.onCancel();
        this.scrollTo('.custom-table');
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
    this.productForm.get('stock')?.enable();
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
    this.loading = false;
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
      this.scrollTo('.custom-table');
    }
  }
}