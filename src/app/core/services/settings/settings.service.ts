import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly _httpClient = inject(HttpClient);

  updateUserData(data: any): Observable<any> {
    return this._httpClient.put(environment.baseUrl + '/api/v1/users/updateMe/', data);
  }

  changePassword(data: any): Observable<any> {
    return this._httpClient.put(environment.baseUrl + '/api/v1/users/changeMyPassword', data);
  }

  addAddress(data: any): Observable<any> {
    return this._httpClient.post(environment.baseUrl + '/api/v1/addresses', data);
  }

  getAllAddresses(): Observable<any> {
    return this._httpClient.get(environment.baseUrl + '/api/v1/addresses');
  }

  deleteAddress(addressId: string): Observable<any> {
    return this._httpClient.delete(environment.baseUrl + `/api/v1/addresses/${addressId}`);
  }
}
