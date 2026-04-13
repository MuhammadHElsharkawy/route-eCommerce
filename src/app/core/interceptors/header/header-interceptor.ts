import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const platformid = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformid)) {
    const token = localStorage.getItem('freshCart_Token');
    if (token) {
      req = req.clone({
        setHeaders: { token }
      });
    }
  }

  return next(req).pipe(
    catchError((err) => {
      console.log('Interceptor Error:', err);
      return throwError(() => err);
    })
  );
};
