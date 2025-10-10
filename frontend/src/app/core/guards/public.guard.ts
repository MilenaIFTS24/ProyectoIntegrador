import { CanActivateChildFn, CanActivateFn } from '@angular/router';

export const publicGuard: CanActivateFn = (route, state) => {
  return true;
};

export const publicChildGuard: CanActivateChildFn = (childRoute, state) => {
  return publicGuard(childRoute, state);
};