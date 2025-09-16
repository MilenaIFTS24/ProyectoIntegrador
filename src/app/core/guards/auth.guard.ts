import { CanActivateChildFn, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};

export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
  // Reutiliza la misma lógica del guard principal
  return authGuard(childRoute, state);
};