import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart, ProductElement } from '../../core/modules/i-cart.interface';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly platformid = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformid)) {
      if (localStorage.getItem('freshCart_Token')) {
        this.getUserCart();
      }
      else {
        this.isLogin.set(false);
      }
    }

  }

  isLogin: WritableSignal<boolean> = signal(true);
  isLoading: WritableSignal<boolean> = signal(false);
  userCart: WritableSignal<ICart | null> = signal(null);

  getUserCart(): void {
    this.isLoading.set(true);
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.userCart.set(res);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    });
  }

  removeItem(product: ProductElement): void {
    Swal.fire({
      title: 'Remove Item?',
      text: `Remove ${product.product.title} from your cart?`,
      iconHtml:
        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2 text-red-500"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Remove',
      customClass: {
        title: 'text-xl! font-bold! text-gray-900! mb-2! p-0!',
        icon: 'w-16 h-16 mx-auto mb-4! rounded-full bg-red-100 flex items-center justify-center border-none!',
        popup: 'rounded-3xl p-10',
        cancelButton: 'cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold! py-3 px-6 rounded-xl transition-all',
        confirmButton: 'cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold! py-3 px-6 rounded-xl transition-all me-3',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeSpecificItem(product._id).subscribe({
          next: (res) => {
            console.log('this method have a bug but not from me, form the api 🤷');
            console.log(res);
            this.cartService.CartItemsNumber.set(res.numOfCartItems);
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    });
  }

  clearCart(): void {
    Swal.fire({
      title: 'Clear Your Cart?',
      text: `All items will be removed from your cart. This action cannot be undone.`,
      iconHtml:
        '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
      showCancelButton: true,
      cancelButtonText: 'Keep Shopping',
      confirmButtonText: 'Yes, Clear All',
      customClass: {
        title: 'text-xl! font-bold! text-gray-900! mb-2! p-0!',
        icon: 'w-16 h-16 mx-auto mb-4! rounded-full bg-red-100 flex items-center justify-center border-none!',
        popup: 'rounded-3xl p-10',
        cancelButton: 'cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold! py-3 px-6 rounded-xl transition-all',
        confirmButton: 'cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold! py-3 px-6 rounded-xl transition-all me-3',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearUserCart().subscribe({
          next: (res) => {
            this.cartService.CartItemsNumber.set(res.numOfCartItems);
            this.getUserCart();
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    });
  }

  cancelLoading: WritableSignal<boolean> = signal(false);
  countLoading: WritableSignal<boolean> = signal(false);
  updateCartCount(productId: string, count: number): void {
    this.cancelLoading.set(true);
    this.countLoading.set(true);
    this.cartService.updateCartQuantity(productId, count).subscribe({
      next: (res) => {
        this.countLoading.set(false);
        this.getUserCart();
      },
      error: (err) => {
        this.countLoading.set(false);
        console.log(err);
      }
    })
  }

}
