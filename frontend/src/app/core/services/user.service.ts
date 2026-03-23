import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _apiService: ApiService) { }

  getUsers(): Observable<User[]> {
    return this._apiService.get<User[]>('users');
  };

  getUserById(id: number): Observable<User> {
    return this._apiService.get<User>(`users/${id}`);
  };

  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this._apiService.post<User>('users', user);
  };

  updateUser(user: User): Observable<User> {
    return this._apiService.put<User>(`users/${user.id}`, user);
  };

  deleteUser(id: number): Observable<User> {
    return this._apiService.delete<User>(`users/${id}`);
  };
  
}
