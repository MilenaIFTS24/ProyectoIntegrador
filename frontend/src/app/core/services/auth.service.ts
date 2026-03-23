import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service'; // Ajusta la ruta
import { User } from '../models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  
  // Tu Signal para saber si hay alguien conectado
  public isLoggedIn = signal<boolean>(!!localStorage.getItem('userToken'));


  loginAction(credentials: any): Observable<any> {
    return this.api.post<any>('auth/login', credentials).pipe(
      tap(res => {
        if (res && res.token) {
          this.login(res.token); // actualizo el signal
        }
      })
    );
  }

  register(userData: User): Observable<any> {
    return this.api.post<any>('auth/register', userData).pipe(
      tap(res => {
        // Para registro con logueo automatico.
        if (res && res.token) {
          this.login(res.token);
        }
      })
    );
  }

  login(token: string) {
    localStorage.setItem('userToken', token);
    this.isLoggedIn.set(true);
  }

  logout() {
    localStorage.removeItem('userToken');
    this.isLoggedIn.set(false);
  }
}