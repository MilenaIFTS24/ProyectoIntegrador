import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model'; // Quité el .js, en TS no se usa
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Usamos el ApiService que ya tiene configurada la URL base del backend
  private api = inject(ApiService);
  private path = 'products';

  /**
   * Obtener todos los productos (Tés y Artesanías)
   */
  getProducts(): Observable<Product[]> {
    return this.api.get<Product[]>(this.path);
  }

  /**
   * Obtener un solo producto por ID
   */
  getProductById(id: number): Observable<Product> {
    return this.api.get<Product>(`${this.path}/${id}`);
  }

  /**
   * Guardar Producto (Lógica inteligente: si tiene ID actualiza, si no, crea)
   */
  saveProduct(product: Product): Observable<Product> {
    if (product.id) {
      // Actualizar producto existente (PUT /api/products/:id)
      return this.api.put<Product>(`${this.path}/${product.id}`, product);
    }
    // Crear nuevo producto (POST /api/products)
    return this.api.post<Product>(this.path, product);
  }

  /**
   * Eliminar producto (Solo para el Admin)
   */
  deleteProduct(id: number): Observable<any> {
    return this.api.delete(`${this.path}/${id}`);
  }
}