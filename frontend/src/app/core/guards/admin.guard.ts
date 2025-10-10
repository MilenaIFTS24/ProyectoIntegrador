import { CanActivateChildFn, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  return true;
};

export const adminChildGuard: CanActivateChildFn = (childRoute, state) => {
  return adminGuard(childRoute, state);
};