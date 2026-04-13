import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { ICart } from '../../modules/i-cart.interface';
import { IProduct } from '../../modules/i-product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _platformid = inject(PLATFORM_ID);

  CartItemsNumber: WritableSignal<number> = signal(0);
  guestCart: WritableSignal<ICart[]> = signal([]);

  addProductToCart(productId: string): Observable<any> {
    return this._httpClient.post(environment.baseUrl + '/api/v2/cart', {
      productId
    });
  }
  getGuestCartFromLocalStorage(): IProduct[] {
    if (isPlatformBrowser(this._platformid)) {
      return JSON.parse(localStorage.getItem('GuestCart') || '[]')
    }
    return [];
  }

  getUserCart(): Observable<any> {
    return this._httpClient.get(environment.baseUrl + '/api/v2/cart');
  }

  removeSpecificItem(productId: string):Observable<any> {
    return this._httpClient.delete(environment.baseUrl + `/api/v2/cart/${{productId}}`);
  }

  clearUserCart(): Observable<any> {
    return this._httpClient.delete(environment.baseUrl + '/api/v2/cart');
  }

  updateCartQuantity(productId: string, productCount: number): Observable<any> {
    return this._httpClient.put(environment.baseUrl + `/api/v1/cart/${productId}`, {
      count: productCount
    })
  }
}
