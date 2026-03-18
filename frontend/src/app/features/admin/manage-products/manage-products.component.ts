import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  // Inyección del servicio desde Core
  private productService = inject(ProductService);

  public products: Product[] = [];
  public loading: boolean = true;
  public errorMessage: string = '';

  ngOnInit(): void {
    this.loadProducts();
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

}