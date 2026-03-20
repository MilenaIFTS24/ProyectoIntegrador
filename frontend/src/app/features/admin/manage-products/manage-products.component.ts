import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  // Inyección del servicio desde Core
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  public products: Product[] = [];
  public loading: boolean = true;
  public errorMessage: string = '';

  public productForm = this.fb.group({
    // --- Campos Generales ---
    id: [null],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    price: [null, [Validators.required, Validators.min(0.01)]],
    stock: [null, [Validators.min(0)]],
    image: [''],
    productType: ['', Validators.required], // Valor por defecto 'té'

    // --- Atributos de Té ---
    brand: [''],
    type: [''],
    origin: [''],
    hasCaffeine: [false],
    isOrganic: [false],
    isFairTrade: [false],
    format: [''],
    weightPerUnit: [null, [Validators.min(0)]],

    // --- Atributos de Artesanía ---
    brandArtist: [''],
    category: [''],
    creationDate: [''],
    weight: [null, [Validators.min(0)]],
    isUnique: [false],
    materials: [[]], // Se maneja como array
    ecoFriendly: [false]

  })

  ngOnInit(): void {
    this.loadProducts();

    // 1. Primero configuramos el "escucha" de cambios
    this.productForm.get('productType')?.valueChanges.subscribe(val => {
      this.toggleFields(val);
    });

    // 2. IMPORTANTE: Forzamos el estado inicial a BLOQUEADO 
    // porque el form arranca en vacío ('')
    this.toggleFields('');
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudo conectar con el servidor.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleFields(type: string | null): void {
    // Normalizamos el valor
    const val = type ? type.toLowerCase().trim() : '';

    // AHORA COMPARAMOS CONTRA LOS VALUES DEL HTML
    const esTe = val === 'tea' || val === 'té';
    const esArtesania = val === 'craft' || val === 'artesanía';

    console.log('ToggleFields recibio:', val, 'esTe:', esTe, 'esArtesania:', esArtesania);

    if (esTe) {
      this.productForm.get('brand')?.enable();
      this.productForm.get('origin')?.enable();
      this.productForm.get('hasCaffeine')?.enable();
      this.productForm.get('format')?.enable();
      // Deshabilitamos lo de artesanía
      this.productForm.get('brandArtist')?.disable();
      this.productForm.get('category')?.disable();
    }
    else if (esArtesania) {
      this.productForm.get('brandArtist')?.enable();
      this.productForm.get('category')?.enable();
      this.productForm.get('isUnique')?.enable();
      // Deshabilitamos lo de té
      this.productForm.get('brand')?.disable();
      this.productForm.get('origin')?.disable();
      this.productForm.get('hasCaffeine')?.disable();
    }
    else {
      // Si no hay nada o es vacío, bloqueamos todo
      this.productForm.get('brand')?.disable();
      this.productForm.get('origin')?.disable();
      this.productForm.get('brandArtist')?.disable();
      this.productForm.get('category')?.disable();
    }
  }

  deleteProduct(product: Product) {
    const confirmacion = confirm(`¿Borrar "${product.name}"?`);

    if (!confirmacion) return;

    this.loading = true;

    if (!product.id) {
      alert('Este producto no tiene un ID válido para eliminar.');
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        alert('Eliminado con éxito');
        // Aquí refrescás la lista
        this.loadProducts();
      },
      error: (err) => {
        alert('Error: ' + err.message);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  updateProduct(product: Product) {
    // 1. Limpiamos rastros de validaciones anteriores
    this.productForm.reset();

    // 2. Diccionario de traducción: Backend (API) -> UI (Lógica de campos)
    // Esto resuelve el error de TypeScript sobre la falta de superposición
    const apiToUiMap: Record<string, 'té' | 'artesanía'> = {
      'tea': 'té',
      'craft': 'artesanía'
    };

    // 3. Obtenemos el tipo para la lógica visual (con un fallback de seguridad)
    const uiType = apiToUiMap[product.productType] || 'té';

    // 4. Habilitamos los campos específicos ANTES de cargar los datos
    // Ahora toggleFields debe aceptar tanto 'tea'/'craft' como 'té'/'artesanía'
    this.toggleFields(uiType);

    // 5. Cargamos todos los valores del objeto en el formulario
    // 'as any' evita que TS se queje por campos extra como fechas o IDs
    this.productForm.patchValue(product as any);

    // 6. REFUERZO: Aseguramos que el SELECT marque la opción correcta
    // Usamos el valor original del backend ('tea' o 'craft')
    this.productForm.get('productType')?.setValue(product.productType, { emitEvent: false });

    console.log(`📦 Editando: ${product.name} | Backend: ${product.productType} | UI: ${uiType}`);

    // 7. Scroll suave hacia arriba para que el usuario vea el formulario listo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    // 1. Obtenemos TODOS los valores (incluyendo IDs y campos bloqueados)
    const f = this.productForm.getRawValue();

    // 2. Determinamos el tipo real (Backend usa 'tea' o 'craft')
    const isTea = f.productType === 'tea' || f.productType === 'té';

    // 3. Construimos el Payload limpio
    const payload: any = {
      name: f.name,
      price: f.price,
      stock: f.stock,
      description: f.description || null,
      productType: isTea ? 'tea' : 'craft', // Enviamos siempre el valor que el backend espera
    };

    // 4. Agregamos campos específicos según el tipo
    if (isTea) {
      payload.brand = f.brand;
      payload.origin = f.origin;
      payload.hasCaffeine = f.hasCaffeine;
      payload.format = f.format;
      payload.isOrganic = f.isOrganic;
      payload.weightPerUnit = f.weightPerUnit;
    } else {
      payload.brandArtist = f.brandArtist;
      payload.category = f.category;
      payload.weight = f.weight;
      payload.isUnique = f.isUnique;
      payload.ecoFriendly = f.ecoFriendly;
    }

    // 5. Si hay ID, es una actualización (PUT), si no, es creación (POST)
    if (f.id) {
      payload.id = f.id;
    }

    console.log('🚀 Enviando Payload al Backend:', payload);

    this.productService.saveProduct(payload).subscribe({
      next: (response) => {
        alert(f.id ? '✅ Producto actualizado' : '✅ Producto creado');
        this.loadProducts(); // Refrescar tabla
        this.onCancel();     // Limpiar formulario y bloquear campos
      },
      error: (err) => {
        alert('❌ Error: ' + err.message);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onCancel() {
  // 1. Reseteamos el formulario a sus valores base
  // El productType debe ser '' para que coincida con "Seleccione..."
  this.productForm.reset({
    id: null,
    name: '',
    productType: '', // <--- Cambiado de 'té' a ''
    price: null,
    stock: null,
    description: '',
    hasCaffeine: false,
    isOrganic: false,
    isFairTrade: false,
    isUnique: false,
    ecoFriendly: false
  });

  // 2. Llamamos a toggleFields con vacío para que bloquee TODO
  this.toggleFields(''); 

  // 3. (Opcional) Limpiamos errores visuales de validación
  this.productForm.markAsPristine();
  this.productForm.markAsUntouched();
}

}