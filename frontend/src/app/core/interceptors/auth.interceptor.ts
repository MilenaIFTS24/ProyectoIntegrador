import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";
import { AuthService } from "../services/auth.service";

// Interceptor de autenticación
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('userToken');
  const router = inject(Router);
  const notify = inject(NotificationService);
  const authService = inject(AuthService);

  const publicRoutes = ['auth/login', 'auth/register', 'products', 'events', 'offers'];
  if (publicRoutes.some(route => req.url.includes(route))) {
    return next(req);
  }

  let cloned = req;

  if (token) {
    const cleanToken = token.replace(/^["']|["']$/g, '');
    cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${cleanToken}`
      }
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        if (!req.url.includes('auth/login')) {
          notify.toast('Su sesión ha expirado o no tiene permisos. Por favor, reingrese.', 'error');
          authService.logout();
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};