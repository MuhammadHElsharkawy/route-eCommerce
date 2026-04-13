import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';
import { WishlistService } from './core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('e-commerce');

  private readonly platformid = inject(PLATFORM_ID);
  private readonly _wishlistService = inject(WishlistService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformid)) {
      AOS.init({
        offset: 50,
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
      if (localStorage.getItem('freshCart_Token')) {
        this.getUserWishlistIds();
      }
    }
  }


  getUserWishlistIds() {
    this._wishlistService.getUserWishlist().subscribe({
      next: (res: any) => {        
        const ids = res.data.map((item: any) => item._id);
        this._wishlistService.wishlistIds.set(ids);
      }
    });
  }
}
