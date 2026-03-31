import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('userToken');
  const router = inject(Router);
  const notify = inject(NotificationService);
  const authService = inject(AuthService);

  // --- PASO 0: BYPASS PARA LOGIN ---
  // Si la petición es para loguearse, NO inyectamos token y NO capturamos el 401 globalmente
  if (req.url.includes('auth/login')) {
    return next(req);
  }

  let cloned = req;

  // 1. Añadir el Token si existe (Para el resto de las rutas)
  if (token) {
    cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // 2. Procesar la petición y capturar errores globales
  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Solo llegamos aquí si NO es la ruta de login
        notify.toast('Sesión expirada. Por favor, ingresa de nuevo.', 'error');
        authService.logout();
        router.navigate(['/login']);
      }
      else if (error.status === 403) {
        notify.toast('No tienes permisos para realizar esta acción.', 'error');
      }

      return throwError(() => error);
    })
  );
};