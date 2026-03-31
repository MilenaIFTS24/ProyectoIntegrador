import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service'; // Tu servicio base de Axios/HttpClient
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  // --- SIGNALS DE ESTADO GLOBAL ---
  public isLoggedIn = signal<boolean>(!!localStorage.getItem('userToken'));
  public userRole = signal<string | null>(localStorage.getItem('userRole'));
  public userName = signal<string | null>(localStorage.getItem('userName'));

  constructor() {}

  // --- MÉTODOS DE ACCIÓN (HTTP) ---

  // Intenta iniciar sesión
  loginAction(credentials: any): Observable<any> {
    return this.api.post('auth/login', credentials);
  }

  // Intenta registrar un nuevo usuario
  registerAction(userData: any): Observable<any> {
    return this.api.post('auth/register', userData);
  }

  // --- MÉTODOS DE ESTADO (LOCAL) ---

  /**
   * Actualiza el estado de la aplicación tras un login/registro exitoso.
   * @param token El JWT enviado por el backend
   * @param user Objeto con { fullName, role, id }
   */
  login(token: string, user: any) {
    // 1. Guardar en LocalStorage
    localStorage.setItem('userToken', token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userName', user.fullName);

    // 2. Actualizar Signals (Reactividad en la UI)
    this.isLoggedIn.set(true);
    this.userRole.set(user.role);
    this.userName.set(user.fullName);
  }

  /**
   * Limpia todo rastro de la sesión y redirige al inicio.
   */
  logout() {
    // 1. Limpiar almacenamiento
    localStorage.clear(); // Opcional: limpia todo para mayor seguridad

    // 2. Resetear Signals
    this.isLoggedIn.set(false);
    this.userRole.set(null);
    this.userName.set(null);

    // 3. Redirigir - Usar navigateByUrl('/') suele ser más seguro 
    // para resetear el estado de las rutas
    this.router.navigateByUrl('/login');
  }

  // Helper para verificar roles rápidamente (opcional)
  isAdmin(): boolean {
    return this.userRole() === 'admin';
  }
}
  