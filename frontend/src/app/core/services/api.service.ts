import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(private _httpClient: HttpClient) { }

  get<T>(path: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this._httpClient.get<T>(`${this.baseUrl}/${path}`, { params, headers }).pipe(
      catchError(this.handleError)
    );
  };

  post<T>(path: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this._httpClient.post<T>(`${this.baseUrl}/${path}`, body, { params, headers }).pipe(
      catchError(this.handleError)
    );
  };

  put<T>(path: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this._httpClient.put<T>(`${this.baseUrl}/${path}`, body, { params, headers }).pipe(
      catchError(this.handleError)
    );
  };

  delete<T>(path: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this._httpClient.delete<T>(`${this.baseUrl}/${path}`, { params, headers }).pipe(
      catchError(this.handleError)
    );
  };

  // Método para manejar errores en las peticiones HTTP
  private handleError(error: any): Observable<never> {
    let errorMensaje = `Código de error:${error.status}\n Descripción:${error.message}`;
    return throwError(() => new Error(errorMensaje));
  };    

}
