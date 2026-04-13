import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly _httpClient = inject(HttpClient);

  addProductToWishlist(productId: string): Observable<any> {
    return this._httpClient.post(environment.baseUrl + '/api/v1/wishlist', productId);
  }
  remodeProductFromWishlist(productId: string): Observable<any> {
    return this._httpClient.delete(environment.baseUrl + `/api/v1/wishlist/${productId}`);
  }
  getUserWishlist(): Observable<any> {
    return this._httpClient.get(environment.baseUrl + '/api/v1/wishlist');
  }

  wishlistIds = signal<string[]>([]);

  
}
