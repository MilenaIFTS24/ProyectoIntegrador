import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  private notify = inject(NotificationService); //Notificaciones toast

  public products: Product[] = [];
  public loading: boolean = true;
  public errorMessage: string = '';

  public productForm = this.fb.group({
    // --- Campos Generales ---
    id: [null],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.maxLength(200)]],
    price: [null, [Validators.required, Validators.min(0.01)]],
    stock: [null, [Validators.min(0), Validators.required]],
    image: [''],
    productType: ['', Validators.required], // Valor por defecto 'té'

    // --- Atributos de Té ---
    brand: ['', [Validators.maxLength(50)]],
    type: [''],
    origin: ['', [Validators.required]],
    hasCaffeine: [false],
    isOrganic: [false],
    isFairTrade: [false],
    format: [''],
    weightPerUnit: [null, [Validators.min(0)]],

    // --- Atributos de Artesanía ---
    brandArtist: ['', [Validators.maxLength(50)]],
    category: [''],
    creationDate: [''],
    weight: [null, [Validators.min(0)]],
    isUnique: [false],
    materials: [''],
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
        this.loading = false;
        // MODIFICACIÓN:
        this.notify.toast('No se pudieron cargar los productos', 'error');
        this.errorMessage = 'Error de conexión con el servidor.';
      }
    });
  }

  toggleFields(type: string | null | undefined): void {
  const val = type ? type.toLowerCase().trim() : '';
  const esTe = val === 'tea' || val === 'té';
  const esArtesania = val === 'craft' || val === 'artesanía';

  // 1. Definimos los grupos de controles
  const camposTe = ['brand', 'type', 'origin', 'format', 'weightPerUnit'];
  const camposArtesania = ['brandArtist', 'category', 'weight', 'materials'];

  // 2. Limpiamos validadores de TODO antes de aplicar los nuevos
  [...camposTe, ...camposArtesania].forEach(name => {
    const control = this.productForm.get(name);
    control?.disable();
    control?.clearValidators();
  });

  // 3. Aplicamos lógica específica
  if (esTe) {
    camposTe.forEach(name => {
      const control = this.productForm.get(name);
      control?.enable();
      // El origen es obligatorio para el Backend en TÉ
      if (name === 'origin') control?.setValidators([Validators.required]);
    });
  } 
  else if (esArtesania) {
    camposArtesania.forEach(name => {
      const control = this.productForm.get(name);
      control?.enable();
      // Materiales es obligatorio para ARTESANÍA
      if (name === 'materials') control?.setValidators([Validators.required, Validators.minLength(3)]);
    });
  }

  // 4. ¡VITAL! Sincronizar el estado del formulario
  [...camposTe, ...camposArtesania].forEach(name => {
    this.productForm.get(name)?.updateValueAndValidity();
  });

  console.log(`🛠️ Formulario validado y configurado para: ${val || 'Ninguno'}`);
}

  async deleteProduct(product: Product) {
    const result = await this.notify.confirm(
      '¿Estás seguro?',
      `Vas a eliminar "${product.name}". Esta acción no se puede deshacer.`
    );

    if (result.isConfirmed) {
      this.loading = true;
      this.productService.deleteProduct(product.id!).subscribe({
        next: () => {
          this.notify.toast('Producto eliminado correctamente');
          this.loadProducts();
        },
        error: (err) => this.notify.toast(err.message, 'error')
      });
    }
  }

  updateProduct(product: Product) {
    // 1. Limpiamos validaciones previas
    this.productForm.reset();

    // 2. Diccionario de traducción: Backend (API) -> UI
    const apiToUiMap: Record<string, 'té' | 'artesanía'> = {
      'tea': 'té',
      'craft': 'artesanía'
    };

    // 3. Obtenemos el tipo para activar los campos correctos
    const uiType = apiToUiMap[product.productType] || 'té';

    // 4. Habilitamos los campos según el tipo (Usando tu nuevo toggleFields optimizado)
    this.toggleFields(uiType);

    // 5. TRATAMIENTO DE MATERIALES: 
    // El backend envía un Array ["Madera", "Vidrio"], 
    // pero el input del HTML necesita un String "Madera, Vidrio"
    let materialsText = '';
    if (product.materials && Array.isArray(product.materials)) {
      materialsText = product.materials.join(', ');
    } else if (typeof product.materials === 'string') {
      materialsText = product.materials;
    }

    // 6. Cargamos los datos en el formulario
    // Usamos el spread (...) para pasar todo el objeto y pisamos 'materials' con el texto plano
    this.productForm.patchValue({
      ...product,
      materials: materialsText
    } as any);

    // 7. REFUERZO: Aseguramos que el SELECT marque la opción correcta (usa el valor del backend)
    this.productForm.get('productType')?.setValue(product.productType, { emitEvent: false });

    // 8. NOTIFICACIÓN: Aviso estético de que estamos editando
    this.notify.toast(`Editando: ${product.name}`, 'info');

    // 9. Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

onSubmit() {
  this.productForm.markAllAsTouched();

  if (this.productForm.invalid) {
    this.notify.toast('Completa los campos obligatorios', 'warning');
    return;
  }

  this.loading = true;
  const f = this.productForm.getRawValue();
  
  // Detectamos el tipo (aceptamos ambas versiones por si el select tiene valores en inglés)
  const isTea = f.productType === 'tea' || f.productType === 'té';

  // 1. Construcción del objeto tipado como Product
  const payload: Product = {
    id: f.id || undefined,
    name: f.name || '',
    price: f.price || 0,
    stock: f.stock || 0,
    description: f.description || '',
    image: f.image || '',
    // USAMOS LOS STRINGS DE LA INTERFAZ:
    productType: isTea ? 'té' : 'artesanía' 
  };

  if (isTea) {
    payload.brand = f.brand || 'Genérica';
    payload.origin = f.origin || 'No especificado';
    payload.type = f.type || 'Mezcla';
    payload.format = f.format || 'Hebras';
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
    
    // Convertimos el string del input a Array de strings para la interfaz
    const materialesRaw = f.materials;
    payload.materials = (materialesRaw && materialesRaw.trim() !== '') 
                        ? materialesRaw.split(',').map((m: string) => m.trim()) 
                        : ['Varios'];
  }

  this.productService.saveProduct(payload).subscribe({
    next: () => {
      this.notify.toast(f.id ? 'Actualizado con éxito' : 'Creado con éxito');
      this.loadProducts();
      this.onCancel();
    },
    error: (err) => {
      this.loading = false;
      this.notify.toast('Error al guardar el producto', 'error');
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