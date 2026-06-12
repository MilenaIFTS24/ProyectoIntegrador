import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";
import { AuthService } from "../services/auth.service";

/**
 * Interceptor encargado de adjuntar el token JWT a las peticiones 
 * y manejar globalmente los errores de autenticación/autorización.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('userToken');
  const router = inject(Router);
  const notify = inject(NotificationService);
  const authService = inject(AuthService);

  // --- 1. BYPASS PARA RUTAS PÚBLICAS O DE AUTH ---
  // Si la petición es para el login, no intervenimos para evitar bucles de redirección
  if (req.url.includes('auth/login')) {
    return next(req);
  }

  let cloned = req;

  // --- 2. INYECCIÓN DEL TOKEN ---
  // Si existe un token almacenado, lo clona en la cabecera de la petición
  if (token) {
    // Limpia comillas dobles o simples que se hayan podido infiltrar en los extremos del token
    const cleanToken = token.replace(/^["']|["']$/g, '');

    cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${cleanToken}`
      }
    });
  }

  // --- 3. PROCESAMIENTO Y MANEJO DE ERRORES ---
  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {

      // 401: Unauthorized (Token inválido o ausente)
      // 403: Forbidden (Token expirado o falta de roles necesarios)
      if (error.status === 401 || error.status === 403) {

        // Ejecutamos la limpieza solo si no estamos ya en la página de login
        // para evitar múltiples mensajes por una sola sesión caída.
        if (!req.url.includes('auth/login')) {

          notify.toast('Su sesión ha expirado o no tiene permisos. Por favor, reingrese.', 'error');

          // Limpia el localStorage y el estado del usuario en el servicio
          authService.logout();

          // Redirección forzada al login
          router.navigate(['/auth/login']);
        }
      }

      // Re-lanzamos el error para que el componente que hizo la petición 
      // también pueda manejarlo si es necesario (ej: apagar un spinner)
      return throwError(() => error);
    })
  );
};