import { Component, inject, input, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { IProduct } from '../../../core/modules/i-product.interface';
import { RouterLink } from "@angular/router";
import { RatingStarsComponent } from "../rating-stars/rating-stars.component";
import { CartService } from '../../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TermcutPipe } from '../../../core/pipes/termcut/termcut-pipe';
import { isPlatformBrowser } from '@angular/common';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { ProductsService } from '../../../core/services/products/products.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, RatingStarsComponent, TermcutPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  private readonly cartService = inject(CartService)
  private readonly toastr = inject(ToastrService);
  private readonly platformid = inject(PLATFORM_ID);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _productsService = inject(ProductsService);

  product = input<IProduct | null>(null);

  isLoading: WritableSignal<boolean> = signal(false);
  done: WritableSignal<boolean> = signal(false);

  getSpesificProduct(productId: string): IProduct | null {
    this._productsService.getSpecificProduct(productId).subscribe({
      next: (res) => {
        return res.data;
      },
      error: () => {
        return null
      }
    })
    return null;
  }

  AddToCart(productId: string): void {
    if (isPlatformBrowser(this.platformid) != null) {
      if (localStorage.getItem('freshCart_Token')) {
        this.addToUserCart(productId);
      }
      else {
        this.addProductToGuestCart(productId);
      }
    }
  }
  addProductToGuestCart(productId: string): void {
    const product: IProduct | null = this.getSpesificProduct(productId);
    if (product) {
      let cart: any[] = JSON.parse(localStorage.getItem('GuestCart') || '[]');
      const existingProductIndex = cart.findIndex(item => item._id === productId);
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
    this.cartService.addProductToCart(productId!).subscribe({
      next: (res) => {
        this.cartService.CartItemsNumber.set(res.numOfCartItems)
        this.isLoading.set(false);
        this.done.set(true);
        setTimeout(() => {
          this.done.set(false);
        }, 1000);
      },
      error: (err) => {
        this.isLoading.set(false);
        // console.log(err);
        this.toastr.error(err.message);
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
    const existingProductIndex = wishlist.findIndex(item => item._id === this.product()?._id);
    if (existingProductIndex > -1) {
      wishlist.splice(existingProductIndex, 1);
    } else {
      wishlist.push(this.product());
    }
    localStorage.setItem('GuestWishlist', JSON.stringify(wishlist));
  }
  addToUserWishlist(): void {
    this.wishlistLoading.set(true);
    this._wishlistService.addProductToWishlist(this.product()?.id!).subscribe({
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





}
