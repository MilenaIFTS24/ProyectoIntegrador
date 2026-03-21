import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model.js';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Inyectamos TU servicio base en lugar del HttpClient directamente
  private api = inject(ApiService);

  // La ruta relativa (el ApiService ya tiene el http://localhost:3000/api)
  private path = 'products';

  // Obtener todos
  getProducts(): Observable<Product[]> {
    return this.api.get<Product[]>(this.path);
  }

  // Obtener uno
  getProductById(id: number): Observable<Product> {
    return this.api.get<Product>(`${this.path}/${id}`);
  }

  // Guardar (Crear o Actualizar)
  saveProduct(product: Product): Observable<any> {
    if (product.id) {
      return this.api.put(`${this.path}/${product.id}`, product);
    }
    return this.api.post(this.path, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.api.delete(`products/${id}`);
  }
}