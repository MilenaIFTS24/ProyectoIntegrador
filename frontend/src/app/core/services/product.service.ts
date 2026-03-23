import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model.js';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // 1. Inyectamos el cliente HTTP (Sintaxis moderna)
  private http = inject(HttpClient);

  // 2. Definimos la URL base usando nuestro environment
  private apiUrl = `${environment.apiUrl}/products`;

  constructor() { }

  // --- MÉTODOS DE LA API ---

  // Obtener todos los productos (Tés y Artesanías)
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Obtener un producto por su ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo producto (para tu panel de admin)
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }
}
