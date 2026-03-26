import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
//import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  //const notify = inject(NotificationService);

  if (authService.isLoggedIn() && authService.userRole() === 'admin') {
    return true;
  }

  // Si no es admin, lo mandamos al dashboard de usuario
  //notify.toast('Acceso denegado: Se requieren permisos de administrador', 'error');
  router.navigate(['/userDashboard']); 
  return false;
};
