import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.min(0)]],
    image: [''],
    productType: ['té', Validators.required], // Valor por defecto 'té'

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

    const inicial = this.productForm.get('productType')?.value as 'té' | 'artesanía';
    this.toggleFields(inicial);

    this.productForm.get('productType')?.valueChanges.subscribe(type => {
      this.toggleFields(type as 'té' | 'artesanía');
    });
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

  private toggleFields(type: 'té' | 'artesanía') {
    const teaFields = ['brand', 'type', 'origin', 'hasCaffeine', 'isOrganic', 'isFairTrade', 'format', 'weightPerUnit'];
    const craftFields = ['brandArtist', 'category', 'creationDate', 'weight', 'isUnique', 'materials', 'ecoFriendly'];

    if (type === 'té') {
      // Habilitar campos de té y deshabilitar artesanía
      teaFields.forEach(field => this.productForm.get(field)?.enable());
      craftFields.forEach(field => this.productForm.get(field)?.disable());
    } else {
      // Habilitar campos de artesanía y deshabilitar té
      craftFields.forEach(field => this.productForm.get(field)?.enable());
      teaFields.forEach(field => this.productForm.get(field)?.disable());
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
    // 1. Limpiamos el estado previo del formulario (validaciones y valores)
    this.productForm.reset();

    // 2. Extraemos y forzamos el tipo del producto ('té' | 'artesanía')
    const type = product.productType as 'té' | 'artesanía';

    // 3. Ejecutamos la lógica de habilitar/deshabilitar campos según el tipo
    // Esto es vital ANTES del patchValue para que los campos existan al llenar
    this.toggleFields(type);

    // 4. Cargamos los datos usando 'as any' para saltar la restricción de null vs number
    // PatchValue ignorará automáticamente campos como 'createdAt' o 'updatedAt'
    this.productForm.patchValue(product as any);

    // 5. Nos aseguramos de que el selector de tipo quede bien marcado
    this.productForm.get('productType')?.setValue(type);

    console.log('✅ Formulario cargado en modo edición:', product.name);
    // Opcional: Hacer scroll hacia el formulario si la lista es larga
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit() {
    // 1. Validamos que el formulario sea correcto
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); // Muestra errores visuales al usuario
      return;
    }

    this.loading = true; // Activamos el spinner del botón

    // 2. Extraemos los datos (getRawValue para incluir campos deshabilitados e ID)
    const f = this.productForm.getRawValue();
    const isTea = f.productType === 'té';

    // 3. Limpiamos el objeto (Payload) para enviar solo lo necesario al Backend
    const payload: any = {
      name: f.name,
      price: f.price,
      stock: f.stock,
      productType: f.productType as 'té' | 'artesanía',
      description: f.description || null,
      // Campos condicionales según el tipo
      ...(isTea ? {
        brand: f.brand,
        origin: f.origin,
        hasCaffeine: f.hasCaffeine,
        format: f.format
      } : {
        brandArtist: f.brandArtist,
        category: f.category,
        isUnique: f.isUnique
      })
    };

    // Si estamos editando, incluimos el ID en el cuerpo o como parámetro
    if (f.id) {
      payload.id = f.id;
    }

    // 4. Llamada al servicio (usando Observables)
    this.productService.saveProduct(payload).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        alert(f.id ? '✅ Producto actualizado con éxito' : '✅ Producto creado con éxito');

        this.loading = false;
        this.onCancel(); // Limpia el formulario y vuelve al estado inicial
      },
      error: (err) => {
        // El error ya viene formateado por el handleError de tu ApiService
        console.error('Error capturado:', err);
        alert('❌ ' + err.message);
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.productForm.reset({
      productType: 'té', // Valor inicial por defecto
      price: 0,
      stock: 0
    });
    this.toggleFields('té'); // Volver a habilitar los campos de té por defecto
  }

}