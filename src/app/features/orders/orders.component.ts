import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { jwtDecode } from 'jwt-decode';
import { OrdersService } from '../../core/services/orders/orders.service';
import { IOrder } from '../../core/modules/i-order.interface';

@Component({
  selector: 'app-orders',
  imports: [RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private readonly _platformid = inject(PLATFORM_ID);
  private readonly _ordersService = inject(OrdersService);

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformid)) {
      const token = localStorage.getItem('freshCart_Token');
      const decode: any = jwtDecode(token!);
      this.userId.set(decode.id);
    }

    if(this.userId()) {
      this.getMyOrders(this.userId()!)
    }
  }

  userId: WritableSignal<string | null> = signal(null);
  userOrders: WritableSignal<IOrder[]> = signal([]);

  getMyOrders(userId: string): void {
    this._ordersService.getUserOrders(userId).subscribe({
      next: (res) => {
        this.userOrders.set(res);
        console.log(this.userOrders());
        
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }
}
