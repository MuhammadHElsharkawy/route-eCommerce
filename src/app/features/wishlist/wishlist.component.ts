import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../core/modules/i-wishlist.interface';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly _wishlistService = inject(WishlistService);

  ngOnInit(): void {
    this.getUserWishlist();
  }

  isLoading: WritableSignal<boolean> = signal(false);
  wishList: WritableSignal<IWishlist | null> = signal(null);

  getUserWishlist(): void {
    this.isLoading.set(true);
    this._wishlistService.getUserWishlist().subscribe({
      next: (res) => {
        this.wishList.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      }
    })
  }
  removeLoading: WritableSignal<boolean> = signal(false);
  removeFromWishlist(productId: string): void {
    this.removeLoading.set(true);
    this._wishlistService.remodeProductFromWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.removeLoading.set(false);
        this.getUserWishlist();
      },
      error: (err) => {
        this.removeLoading.set(false);
        console.log(err);
      }
    })
  }
}
