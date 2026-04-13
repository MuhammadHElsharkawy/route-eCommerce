import { Component, inject, signal } from '@angular/core';
import { ProductsService } from '../../../../core/services/products/products.service';
import { IProduct } from '../../../../core/modules/i-product.interface';
import { ProductCardComponent } from "../../../../shared/components/product-card/product-card.component";
import { SectionTitleComponent } from "../../../../shared/components/section-title/section-title.component";

@Component({
  selector: 'app-home-products',
  imports: [ProductCardComponent, SectionTitleComponent],
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.css',
})
export class HomeProductsComponent {
  private readonly productsService = inject(ProductsService);

  ngOnInit(): void {
    this.getAllProducts();
  }

  productList = signal<IProduct[]>([]);
  specificProduct = signal<IProduct|null>(null);

  getAllProducts(): any {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);        
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  getSpecificProduct(productId: string): any {
    this.productsService.getSpecificProduct(productId).subscribe({
      next: (res) => {
        this.specificProduct.set(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
