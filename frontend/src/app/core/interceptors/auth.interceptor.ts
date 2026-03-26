import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtenemos el token del LocalStorage
  const token = localStorage.getItem('userToken');

  // 2. Si existe el token, clonamos la petición y le añadimos el Header
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // 3. Si no hay token (ej: login o registro), la petición sigue normal
  return next(req);
};