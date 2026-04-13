import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { InputFieldComponent } from "../../../../shared/components/input-field/input-field.component";
import { LoginMassegeComponent } from "../../../../shared/components/login-massege/login-massege.component";
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../../core/services/cart/cart.service';
import { IProduct } from '../../../../core/modules/i-product.interface';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputFieldComponent, LoginMassegeComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly platformid = inject(PLATFORM_ID);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.formInit()
  }

  loginForm!: FormGroup;
  formInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    })
  }

  isLoading: WritableSignal<boolean> = signal(false);

  login(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('freshCart_Token', res.token)
          localStorage.setItem('freshCart_user', JSON.stringify(res.user))
          this.router.navigate(['/home']);
          this.isLoading.set(false);
          this.authService.isLogedIn.set(true);
          this.authService.userData.set(res.user)
          this.toastr.success('Login success')
          this.syncLocalCartWithAPI();
        },
        error: (err) => {
          this.toastr.error(err.error.message);
          this.isLoading.set(false);
        }
      })
    }
  }

  syncLocalCartWithAPI(): void {
    const localCart: IProduct[] = this.cartService.getGuestCartFromLocalStorage();
    if (localCart.length === 0) return;

    const requests = localCart.map(produtct => {
      return this.cartService.addProductToCart(produtct._id).pipe(catchError(err => {
        return of(null);
      })
      );
    });

    forkJoin(requests).pipe(
      finalize(() => {
        if (isPlatformBrowser(this.platformid)) {
          localStorage.removeItem('GuestCart');
        }
        this.cartService.getUserCart().subscribe();
      })
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Your cart items have been saved!');
      }
    })
  }

  passwordShown: WritableSignal<boolean> = signal(false);
  togglePassword(): void {
    this.passwordShown.set(!this.passwordShown());
  }
  
}
