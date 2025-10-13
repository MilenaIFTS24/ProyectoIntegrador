import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _apiService: ApiService) { }

  getProducts(): Observable<Product[]> {
    return this._apiService.get<Product[]>('productos');
  };

  getProductById(id: number): Observable<Product> {
    return this._apiService.get<Product>(`productos/${id}`);
  };
  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this._apiService.post<Product>('productos', product);
  };

  updateProduct(product: Product): Observable<Product> {
    return this._apiService.put<Product>(`productos/${product.id}`, product);
  };

  deleteProduct(id: number): Observable<void> {
    return this._apiService.delete<void>(`productos/${id}`);
  };
}
