import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly _httpClient = inject(HttpClient);

  getAllBrands(): Observable<any> {
    return this._httpClient.get(environment.baseUrl + '/api/v1/brands');
  }
  getABrand(brandId: string): Observable<any> {
    return this._httpClient.get(environment.baseUrl + `/api/v1/brands/${brandId}`);
  }
  // getBrandProducts(brandId: string): Observable<any> {
  //   return this._httpClient.get(environment.baseUrl + `/api/v1/brands/${brandId}`);
  // }
}
