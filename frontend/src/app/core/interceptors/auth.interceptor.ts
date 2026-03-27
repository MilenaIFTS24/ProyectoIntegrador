import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
//import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('userToken');
  const router = inject(Router);
  //const notify = inject(NotificationService);
  const authService = inject(AuthService);

  let cloned = req;

  // 1. Añadir el Token si existe
  if (token) {
    cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // 2. Procesar la petición y capturar errores globales
  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      
      if (error.status === 401) {
        // TOKEN EXPIRADO O INVÁLIDO
        //notify.toast('Sesión expirada. Por favor, ingresa de nuevo.', 'error');
        authService.logout(); // Limpia los Signals y el LocalStorage
        router.navigate(['/login']);
      } 
      
      else if (error.status === 403) {
        // NO TIENE PERMISOS
        //notify.toast('No tienes permisos para realizar esta acción.', 'error');
      }

      // Devolvemos el error para que el componente también pueda manejarlo si lo necesita
      return throwError(() => error);
    })
  );
};