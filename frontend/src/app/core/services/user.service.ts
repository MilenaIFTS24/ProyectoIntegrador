import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _apiService: ApiService) { }

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this._apiService.get<User[]>('users');
  };

  // Obtener un usuario por ID
  getUserById(id: number): Observable<User> {
    return this._apiService.get<User>(`users/${id}`);
  };

  // Guardar un usuario
  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this._apiService.post<User>('users', user);
  };

  // Actualizar un usuario
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this._apiService.put<User>(`users/${user.id}`, user);
  };

  // Eliminar un usuario
  deleteUser(id: number): Observable<User> {
    return this._apiService.delete<User>(`users/${id}`);
  };
  
}
