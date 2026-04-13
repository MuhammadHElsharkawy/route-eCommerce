import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformid = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformid)) {

    if (localStorage.getItem('freshCart_Token')) {
      return true;
    }
    else
      return router.parseUrl('/login')
  }
  return true;
};
