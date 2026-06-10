import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
    const body = {
      email: credentials.email,
      password: credentials.password
    };

    return this.api['_httpClient'].post(
      `${environment.authUrl}/token?grant_type=password`,
      body,
      {
        headers: this.api['getHeaders']()
      }
    );
  }
  registerAction(userData: any): Observable<any> {
    const body = {
      email: userData.email,
      password: userData.password,
      data: {
        fullName: userData.fullName,
        role: userData.role || 'user'
      }
    };

    return this.api['_httpClient'].post(
      `${environment.authUrl}/signup`,
      body,
      {
        headers: this.api['getHeaders']()
      }
    );
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
    this.router.navigateByUrl('/login');
  }

  isAdmin(): boolean {
    return this.userRole() === 'admin';
  }
}