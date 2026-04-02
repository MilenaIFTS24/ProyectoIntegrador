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

  // Signals sincronizados con el Storage
  public userToken = signal<string | null>(localStorage.getItem('userToken'));
  public userRole = signal<string | null>(localStorage.getItem('userRole'));
  public userName = signal<string | null>(localStorage.getItem('userName'));

  // Estado computado: solo es verdadero si existe el TOKEN
  public isLoggedIn = computed(() => !!this.userToken());

  constructor() {
    // Si hay token pero no hay rol (estado corrupto), limpiamos
    if (this.userToken() && !this.userRole()) {
      this.logout();
    }
  }

  // --- ACCIONES HTTP ---
  loginAction(credentials: any): Observable<any> {
    return this.api.post('auth/login', credentials);
  }

  registerAction(userData: any): Observable<any> {
    return this.api.post('auth/register', userData);
  }

  // --- GESTIÓN DE SESIÓN ---
  login(token: string, user: any): void {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userName', user.fullName);

    this.userToken.set(token);
    this.userRole.set(user.role);
    this.userName.set(user.fullName);

    const route = user.role === 'admin' ? '/adminDashboard' : '/userDashboard';
    this.router.navigateByUrl(route);
  }

  logout(): void {
    localStorage.clear();
    this.userToken.set(null);
    this.userRole.set(null);
    this.userName.set(null);
    this.router.navigateByUrl('/login');
  }

  isAdmin(): boolean {
    return this.userRole() === 'admin';
  }
}