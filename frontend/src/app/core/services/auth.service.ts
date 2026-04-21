import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  // Mantenemos esta Signal para la reactividad de la Navbar
  private authState = signal<{ token: string | null, user: any | null }>({
    token: localStorage.getItem('userToken'),
    user: JSON.parse(localStorage.getItem('userData') || 'null')
  });

  // Signals públicos para tu Navbar (estos son los que agregamos ahora)
  public isLoggedIn = computed(() => !!this.authState().token);
  public userName = computed(() => this.authState().user?.fullName || null);
  public userRole = computed(() => this.authState().user?.role || null);

  constructor() {
    // Tu validación original
    if (this.authState().token && !this.authState().user?.role) {
      this.logout();
    }
  }

  // --- Mantenemos loginAction tal cual ---
  loginAction(credentials: any): Observable<any> {
    return this.api.post('auth/login', credentials);
  }

  registerAction(userData: any): Observable<any> {
    return this.api.post('auth/register', userData);
  }

  // --- Mantenemos el método login original con sus argumentos ---
  login(token: string, user: any): void {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    // También guardamos estos si tu código viejo los busca por separado
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userName', user.fullName);

    // ACTUALIZAMOS LA SIGNAL (esto es lo que arregla tu Navbar)
    this.authState.set({ token, user });

    const route = user.role === 'admin' ? '/adminDashboard' : '/userDashboard';
    this.router.navigateByUrl(route);
  }

  // --- Mantenemos logout original ---
  logout(): void {
    localStorage.clear();
    
    // RESETEAMOS LA SIGNAL (esto limpia el nombre en la Navbar al instante)
    this.authState.set({ token: null, user: null });
    
    this.router.navigateByUrl('/login');
  }

  // Tu método extra
  clearSession() {
    localStorage.clear();
    this.authState.set({ token: null, user: null });
  }

  isAdmin(): boolean {
    return this.userRole() === 'admin';
  }
}