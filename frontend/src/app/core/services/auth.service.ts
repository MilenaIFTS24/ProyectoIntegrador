import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private authState = signal<{ token: string | null, user: any | null }>({
    token: localStorage.getItem('userToken'),
    user: JSON.parse(localStorage.getItem('userData') || 'null')
  });

  private hasToken(): boolean {
    return !!localStorage.getItem('userToken');
  }

  // Signals públicos para el navbar
  public isLoggedIn = computed(() => !!this.authState().token);
  public userName = computed(() => this.authState().user?.fullName || null);
  public userRole = computed(() => this.authState().user?.role || null);

  constructor() {
    const state = this.authState();
    if (state.token && !state.user) {
      this.logout();
    }
  }

  loginAction(credentials: any): Observable<any> {
    return this.api.post('auth/login', credentials);
  }

  registerAction(userData: any): Observable<any> {
    return this.api.post('auth/register', userData);
  }

  login(token: string, user: any): void {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(user));

    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userName', user.fullName);

    this.authState.set({ token, user });

    const route = user.role === 'admin' ? '/adminDashboard' : '/userDashboard';
    this.router.navigateByUrl(route);
  }

  clearSession() {
    localStorage.clear();
    sessionStorage.clear();

    this.authState.set({ token: null, user: null });
  }

  logout(): void {
    this.clearSession();
    this.router.navigateByUrl('/');
  }

  isAdmin(): boolean {
    return this.userRole() === 'admin';
  }
}