import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { IUser } from '../../../../core/modules/i-user.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly platformid = inject(PLATFORM_ID);

  // constructor() {
  //   if(isPlatformBrowser(this.platformid)) {
  //     const savedUser = localStorage.getItem('freshCart_user');
  //     if (savedUser) {
  //       this.userData.set(JSON.parse(savedUser));
  //     }
  //   }
  // }

  isLogedIn: WritableSignal<boolean> = signal(false);
  userData: WritableSignal<IUser | null> = signal(null);

  signUp(data: any): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/api/v1/auth/signup', data);
  }

  signIn(data: any): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/api/v1/auth/signin', data);
  }

  forgotPass(email: any): Observable<any> {
    // localStorage.setItem('userEmail', JSON.stringify(email));
    return this.httpClient.post(environment.baseUrl + '/api/v1/auth/forgotPasswords', email);
  }

  verifyEmail(code: any): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/api/v1/auth/verifyResetCode', code);
  }

  resetPass(data: any): Observable<any> {
    return this.httpClient.put(environment.baseUrl + '/api/v1/auth/resetPassword', data);
  }

  verifyToken(data: any): Observable<any> {
    return this.httpClient.get(environment.baseUrl + '/api/v1/auth/verifyToken');
  }
}
