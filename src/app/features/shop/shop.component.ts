import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component";
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../core/modules/i-product.interface';
import { GradientHeaderComponent } from "../../shared/components/gradient-header/gradient-header.component";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../core/modules/i-brand.interface';
import { IHeader } from '../../core/modules/i-header.interface';
import { ICategory } from '../../core/modules/i-category.interface';
import { CategoriesService } from '../../core/services/categories.service';
import { ISubCategory } from '../../core/modules/i-subcategory.interface';

@Component({
  selector: 'app-shop',
  imports: [ProductCardComponent, GradientHeaderComponent, RouterLink],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  private readonly _productsService = inject(ProductsService);
  private readonly _brandsService = inject(BrandsService);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      const brandId = params['brand']
      const categoryId = params['category']
      const subcategoryId = params['subcategory']

      if (categoryId) {
        this.productType.set('filter');
        this.getACategory(categoryId);
        this.getProductsBy('category', categoryId!);
        this.aBrand.set(null);
        this.aSubcategory.set(null);
      } else if (brandId) {
        this.productType.set('filter');
        this.getABrand(brandId);
        this.getProductsBy('brand', brandId!);
        this.aCategory.set(null);
        this.aSubcategory.set(null);
      } else if (subcategoryId) {
        this.productType.set('filter');
        this.getASubcategory(subcategoryId);
        this.getProductsBy('subcategory', subcategoryId);
        this.aCategory.set(null);
        this.aBrand.set(null);
      } else {
        this.productType.set('all');
        this.getAllProducts();
        this.headerInit();
      }
    })
  }

  productType: WritableSignal<'all' | 'filter'> = signal('all');

  isLoading: WritableSignal<boolean> = signal(false);
  productList = signal<IProduct[]>([]);
  getAllProducts(): any {
    this.isLoading.set(true);
    this._productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      }
    })
  }
  getProductsBy(by: string, id: string): any {
    this.isLoading.set(true);
    this._productsService.getProductsBy(by, id).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.productList.set(res.data);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      }
    })
  }


  headerData: WritableSignal<IHeader | null> = signal(null);
  headerInit(): void {
    this.headerData.set({
      title: 'All Products',
      description: 'Explore our complete product collection',
      icon: 'fa-box-open',
      image: ''
    })
  }
  updateHeader(data: any) {
    this.headerData.set({
      title: data.name,
      image: data.image,
      description: `Shop ${this.aBrand()?.name} products`,
    });
  }

  aBrand: WritableSignal<IBrand | null> = signal(null);
  getABrand(brandId: string): void {
    this._brandsService.getABrand(brandId).subscribe({
      next: (res) => {
        this.productType.set('filter');
        this.aBrand.set(res.data);
        this.updateHeader(res.data)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  aCategory: WritableSignal<ICategory | null> = signal(null);
  getACategory(categoryId: string): void {
    this._categoriesService.getSpecificCategory(categoryId).subscribe({
      next: (res) => {
        this.productType.set('filter');
        this.aCategory.set(res.data);
        this.updateHeader(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  aSubcategory: WritableSignal<ISubCategory | null> = signal(null);
  getASubcategory(subcategoryId: string): void {
    this._categoriesService.getSpecificSubCategory(subcategoryId).subscribe({
      next: (res) => {
        this.productType.set('filter');
        this.aSubcategory.set(res.data);
        this.updateHeader(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
