import { Component, computed, ElementRef, HostListener, inject, OnInit, PLATFORM_ID, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite-service.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../features/auth/services/auth/auth.service';
import { IUser } from '../../../core/modules/i-user.interface';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [RouterLink],
})
export class NavbarComponent implements OnInit {
  private readonly flowbiteService = inject(FlowbiteService)
  private readonly auth = inject(AuthService)
  private readonly router = inject(Router)
  private readonly platformid = inject(PLATFORM_ID)
  private readonly cartService = inject(CartService)

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    this.checkLogedIn();
    this.getUserData();
    this.getUserCart();
  }

  cartNumber = computed(() => this.cartService.CartItemsNumber())
  getUserCart(): void {
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.cartService.CartItemsNumber.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isSideNavOpen: boolean = false;
  openSideNav(): void {
    this.isSideNavOpen = true;
  }
  closeSideNav(): void {
    this.isSideNavOpen = false;
  }

  isLogedIn: Signal<boolean> = computed(() => this.auth.isLogedIn())
  checkLogedIn(): void {
    if (isPlatformBrowser(this.platformid)) {
      if (localStorage.getItem('freshCart_Token'))
        this.auth.isLogedIn.set(true);
      else
        this.auth.isLogedIn.set(false);
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformid)) {
      localStorage.removeItem('freshCart_Token')
      localStorage.setItem('GuestCart', JSON.stringify([]))
      localStorage.setItem('GuestWishlist', JSON.stringify([]))
    }
    this.router.navigate(['/login'])
    this.auth.isLogedIn.set(false);
    this.auth.userData.set(null);
  }

  userdata: Signal<IUser | null> = computed(() => this.auth.userData())
  getUserData(): void {
    if (isPlatformBrowser(this.platformid)) {
      if (this.isLogedIn()) {
        const user = signal<IUser>(JSON.parse(localStorage.getItem('freshCart_user')!))
        this.auth.userData.set(user());
      }
    }
  }


  userDropListOpened: WritableSignal<boolean> = signal(false);
  toggleUserList(event: Event): void {
    this.userDropListOpened.set(!this.userDropListOpened());
    event.stopPropagation();
  }
  @HostListener('document:click')
  closeUserList(): void {
    this.userDropListOpened.set(false);
  }

}

// decodedToken: WritableSignal<IDecodedToken | null> = signal(null);
// verifyToken(): void {
//   const token = signal<string>('');
//   if (isPlatformBrowser(this.platformid)) {
//     token.set(localStorage.getItem('freshCart_Token')!)
//   }
//   const myHeaders = new HttpHeaders({
//     'token': token()
//   });

//   this.auth.verifyToken({ headers: myHeaders }).subscribe({
//     next: (res) => {
//       this.decodedToken.set(res.decoded)
//     },
//     error: (err) => {
//       console.log(err)
//     }
//   })
// }