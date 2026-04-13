import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { OrdersService } from '../../core/services/orders/orders.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _ordersService = inject(OrdersService);
  private readonly _router = inject(Router);

  cartId: WritableSignal<string> = signal('');
  ngOnInit(): void {
    this.checkoutForm = this._fb.group({
      city: [null, [Validators.required]],
      details: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    })

    this._activatedRoute.paramMap.subscribe({
      next: (parem) => {
        this.cartId.set(parem.get('cartId')!);
      }
    })
  }
  checkoutForm!: FormGroup;

  paymentType: WritableSignal<'cash' | 'online'> = signal('cash');
  choosePaymentType(type: 'cash' | 'online'): void {
    this.paymentType.set(type);
  }

  checkout(): void {
    if (this.checkoutForm.invalid) {
      for (const key of Object.keys(this.checkoutForm.controls)) {
        const control = this.checkoutForm.get(key);
        if (control?.invalid) {
          const invalidElement = document.querySelector(`[formControlName="${key}"], [formGroupName] [formControlName]`);
          if (invalidElement) {
            (invalidElement as HTMLElement).focus();
            invalidElement.scrollIntoView({ block: 'center' });
          }
          break;
        }
      }
    }
    if (this.paymentType() == 'cash') {
      this.payCash();
    }
    else {
      this.payOnline();
    }
  }

  payOnline(): void {
    if (this.checkoutForm.valid) {
      let payload = {
        shippingAddress: this.checkoutForm.value
      }
      this._ordersService.checkoutSession(this.cartId(), payload).subscribe({
        next: (res) => {
          if (res.status == 'success') {
            window.open(res.session.url, '_self')
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  payCash(): void {
    if (this.checkoutForm.valid) {
      let payload = {
        shippingAddress: this.checkoutForm.value
      }
      // console.log(payload);
      // console.log(this.cartId());

      this._ordersService.payCash(this.cartId(), payload).subscribe({
        next: (res) => {
          console.log(res);
          this._router.navigate(['/allorders']);
        },
        error: (err) => {
          console.log(err);

        },
      })
    }
  }
}
