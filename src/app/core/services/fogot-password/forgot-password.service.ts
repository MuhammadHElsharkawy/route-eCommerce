import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  private readonly httpClient = inject(HttpClient)

  get userEmail(): string {
    if(localStorage.getItem('userEmail')) {
      return JSON.parse(localStorage.getItem('userEmail')!)
    }
    return '';
  }
  // userEmail = signal<string>('');
  forgotPassword(email: any): Observable<any> {
    // this.userEmail.set(email);
    localStorage.setItem('userEmail', JSON.stringify(email));
    return this.httpClient.post(environment.baseUrl + '/api/v1/auth/forgotPasswords', email);
  }
  
  verifyCode(code: any): Observable<any> {
    return this.httpClient.post(environment.baseUrl + '/api/v1/auth/verifyResetCode', code);
  }

  resetPassword(data: any): Observable<any> {
    return this.httpClient.put(environment.baseUrl + '/api/v1/auth/resetPassword', data);
  }
}
