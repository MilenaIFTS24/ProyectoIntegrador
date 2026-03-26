import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = inject(ApiService);
  public isLoggedIn = signal<boolean>(!!localStorage.getItem('userToken'));

  constructor() { }

  login(token: string, user: User) {
    localStorage.setItem('userToken', token);
    this.isLoggedIn.set(true);
  }

  logout() {
    localStorage.removeItem('userToken');
    this.isLoggedIn.set(false);
  }

  registerAction(userData: User): Observable<any> {
    return this.api.post<any>('auth/register', userData).pipe(
      tap(response => {
        if (response && response.token) {
          this.login(response.token, response.user);
        }
      })
    );
  }

}
