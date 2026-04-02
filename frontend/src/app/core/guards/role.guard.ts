import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos sesión Y rol en una sola línea
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  // Si no es admin pero está logueado, va a su dashboard
  if (authService.isLoggedIn()) {
    router.navigate(['/userDashboard']);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};