import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private api = inject(ApiService);
  private path = 'products';

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.api.get<Product[]>(this.path);
  }

  // Obtener un producto por ID
  getProductById(id: number): Observable<Product> {
    return this.api.get<Product>(`${this.path}/${id}`);
  }

  // Guardar o actualizar un producto
  saveProduct(product: Product): Observable<Product> {
    if (product.id) {
      return this.api.put<Product>(`${this.path}/${product.id}`, product);
    }
    
    return this.api.post<Product>(this.path, product);
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<any> {
    return this.api.delete(`${this.path}/${id}`);
  }
}