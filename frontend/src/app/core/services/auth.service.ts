import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn = signal<boolean>(!!localStorage.getItem('userToken'));
  public userRole = signal<string | null>(localStorage.getItem('userRole'));
  constructor() { }
}
