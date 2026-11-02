import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const alreadyLoggedGuard: CanActivateFn = (route, state) => {
  let router = inject(Router)
  if (localStorage.getItem('token')) {
    return router.parseUrl("/feed")
  } else {
    return true
  }
};
