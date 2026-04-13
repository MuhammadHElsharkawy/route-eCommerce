import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { GradientHeaderComponent } from "../../shared/components/gradient-header/gradient-header.component";
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../core/modules/i-brand.interface';
import { RouterLink } from "@angular/router";
import { ProductsService } from '../../core/services/products/products.service';

@Component({
  selector: 'app-brands',
  imports: [GradientHeaderComponent, RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly _brandsService = inject(BrandsService);
  private readonly _productsService = inject(ProductsService);

  ngOnInit(): void {
    this.getAllBrands();
  }

  isLoading: WritableSignal<boolean> = signal(false);
  allBrands: WritableSignal<IBrand[]> = signal([]);
  getAllBrands(): void {
    this.isLoading.set(true);
    this._brandsService.getAllBrands().subscribe({
      next: (res) => {
        this.allBrands.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      }
    })
  }

  // getBrandProducts(brandId: string): void {
  //   this._productsService.getProductsBy(brandId).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   })
  // }
}
