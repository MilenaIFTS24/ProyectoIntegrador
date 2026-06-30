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

  private authState = signal<{ token: string | null, user: any | null }>(
    this.validateSession()
  );

  public isLoggedIn = computed(() => !!this.authState().token);
  public userName = computed(() => this.authState().user?.fullName || null);
  public userRole = computed(() => this.authState().user?.role || null);

  constructor() {
    const initial = this.validateSession();
    this.authState.set(initial);
  }

  public getCurrentUser(): any {
    return this.authState().user;
  }

  public getUserId(): string | null {
    return this.authState().user?.id || null;
  }

  private validateSession(): { token: string | null, user: any | null } {
    const token = localStorage.getItem('userToken');
    const userStr = localStorage.getItem('userData');

    if (!token || !userStr || token === 'null' || token === 'undefined' || userStr === 'null' || userStr === 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      return { token: null, user: null };
    }

    try {
      const user = JSON.parse(userStr);
      return { token, user };
    } catch (e) {
      localStorage.clear();
      sessionStorage.clear();
      return { token: null, user: null };
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
    this.authState.set({ token, user });
    const route = user.role === 'admin' ? '/adminDashboard' : '/userDashboard';
    this.router.navigateByUrl(route);
  }

  clearSession(): void {
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