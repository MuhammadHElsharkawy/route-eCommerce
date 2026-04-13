import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, input, OnInit, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../core/modules/i-product.interface';
import { RatingStarsComponent } from "../../shared/components/rating-stars/rating-stars.component";
import { ProductCardComponent } from "../../shared/components/product-card/product-card.component";
import { register } from 'swiper/element/bundle';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-product-details',
  imports: [RatingStarsComponent, ProductCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly _productsService = inject(ProductsService)
  private readonly _cartService = inject(CartService)
  private readonly _wishlistService = inject(WishlistService)
  private readonly platformid = inject(PLATFORM_ID)

  ngOnInit(): void {
    if (this.id()) {
      this.getSpecificProduct(this.id()!)
      this.mainImg.set(this.productData()?.imageCover!)
    }
    register()
  }
  ngAfterViewInit(): void {
    const swiperParams = {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      spaceBetween: 16,
      centeredSlides: false,
      watchSlidesProgress: true,
      watchOverflow: true,
      allowTouchMove: true,
      resistance: true,
      resistanceRatio: 0,
    };
    Object.assign(this.homeSwiper.nativeElement, swiperParams);
    this.homeSwiper.nativeElement.initialize();
  }



  isLoading: WritableSignal<boolean> = signal(false);
  done: WritableSignal<boolean> = signal(false);

  AddToCart(productId: string): void {
    if (isPlatformBrowser(this.platformid) != null) {
      if (localStorage.getItem('freshCart_Token')) {
        this.addToUserCart(productId);
      }
      else {
        this.addProductToGuestCart(this.productData()!);
      }
    }
  }
  addProductToGuestCart(product: IProduct): void {
    if (product) {
      let cart: any[] = JSON.parse(localStorage.getItem('GuestCart') || '[]');
      const existingProductIndex = cart.findIndex(item => item._id === product._id);
      if (existingProductIndex > -1) {
        cart[existingProductIndex].count += 1;
      } else {
        cart.push({ ...product, count: 1 });
      }

      localStorage.setItem('GuestCart', JSON.stringify(cart));
      this.done.set(true);
      setTimeout(() => {
        this.done.set(false);
      }, 1000);
    }
  }
  addToUserCart(productId: string): void {
    this.isLoading.set(true);
    this._cartService.addProductToCart(productId!).subscribe({
      next: (res) => {
        this._cartService.CartItemsNumber.set(res.numOfCartItems)
        this.isLoading.set(false);
        this.done.set(true);
        setTimeout(() => {
          this.done.set(false);
        }, 1000);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      }
    })
  }


  wishlistLoading: WritableSignal<boolean> = signal(false);
  isInWishlist(productId: string): boolean {
    if (isPlatformBrowser(this.platformid)) {
      let wishlist: any[] = JSON.parse(localStorage.getItem('GuestWishlist') || '[]');
      return wishlist.some(item => item._id == productId);
    }
    return false;
  }
  AddToWishlist(): void {
    if (isPlatformBrowser(this.platformid) != null) {
      if (localStorage.getItem('GuestCart')) {
        this.addProductToGuestWishlist();
      }
      else {
        this.addToUserWishlist();
      }
    }
  }
  addProductToGuestWishlist(): void {
    let wishlist: any[] = JSON.parse(localStorage.getItem('GuestWishlist') || '[]');
    const existingProductIndex = wishlist.findIndex(item => item._id === this.productData()?._id);
    if (existingProductIndex > -1) {
      wishlist.splice(existingProductIndex, 1);
    } else {
      wishlist.push(this.productData());
    }
    localStorage.setItem('GuestWishlist', JSON.stringify(wishlist));
  }
  addToUserWishlist(): void {
    this.wishlistLoading.set(true);
    this._wishlistService.addProductToWishlist(this.productData()?.id!).subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.wishlistLoading.set(false);
      }
    })
  }




  id = input<string>();
  productData = signal<IProduct | null>(null);
  categoryProducts = signal<IProduct[]>([]);

  getSpecificProduct(id: string): void {
    this._productsService.getSpecificProduct(id).subscribe({
      next: (res) => {
        this.productData.set(res.data);
        this.getCategoryProducts();
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  getCategoryProducts(): void {
    this._productsService.getProductsBy('category', this.productData()?.category._id!).subscribe({
      next: (res) => {
        this.categoryProducts.set(res.data);
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  scrollIntoView(e: Event): void {
    const element: HTMLElement = e.currentTarget as HTMLElement
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    })
  }

  mainImg = signal<string>('');
  changeCoverImg(img: string): void {
    this.mainImg.set(img);
  }

  activeTab: WritableSignal<'details' | 'reviews' | 'shipping'> = signal('details');
  changeTab(tab: 'details' | 'reviews' | 'shipping'): void {
    this.activeTab.set(tab);
  }



  @ViewChild('homeSwiper') homeSwiper!: ElementRef;

  swiperLeft(): void {
    this.homeSwiper.nativeElement.swiper.slidePrev();
  }
  swiperRight(): void {
    this.homeSwiper.nativeElement.swiper.slideNext();
  }
}
