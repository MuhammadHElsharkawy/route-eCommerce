import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly _httpClient = inject(HttpClient);

  checkoutSession(cartId: string, data: any): Observable<any>{
    return this._httpClient.post(environment.baseUrl + `/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`, data)
  }

  payCash(cartId: string, data: any): Observable<any> {
    return this._httpClient.post(environment.baseUrl + `/api/v2/orders/${cartId}`, data);
  }

  getUserOrders(userId: string): Observable<any> {
    return this._httpClient.get(environment.baseUrl + `/api/v1/orders/user/${userId}`);
  }
}
