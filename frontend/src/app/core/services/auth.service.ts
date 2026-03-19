import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn = signal<boolean>(!!localStorage.getItem('userToken'));

  constructor() { }

  login(token: string) {
    localStorage.setItem('userToken', token);
    this.isLoggedIn.set(true);
  }

  logout() {
    localStorage.removeItem('userToken');
    this.isLoggedIn.set(false);
  }

}
