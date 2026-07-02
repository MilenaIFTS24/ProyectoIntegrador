import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private _httpClient: HttpClient) { }

  // Obtener los headers con el token
  private getHeadersWithToken(customHeaders?: HttpHeaders): HttpHeaders {
    let headers = customHeaders || new HttpHeaders();

    const token = localStorage.getItem('userToken'); 

    if (token && !headers.has('Authorization')) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // --- Métodos HTTP ---

  // GET
  get<T>(path: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const secureHeaders = this.getHeadersWithToken(headers);
    return this._httpClient.get<T>(`${this.baseUrl}/${path}`, { params, headers: secureHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  // POST
  post<T>(path: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const secureHeaders = this.getHeadersWithToken(headers);
    return this._httpClient.post<T>(`${this.baseUrl}/${path}`, body, { params, headers: secureHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  // PUT
  put<T>(path: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const secureHeaders = this.getHeadersWithToken(headers);
    return this._httpClient.put<T>(`${this.baseUrl}/${path}`, body, { params, headers: secureHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  // PATCH
  patch<T>(path: string, body: any): Observable<T> {
    const secureHeaders = this.getHeadersWithToken();
    return this._httpClient.patch<T>(`${this.baseUrl}/${path}`, body, { headers: secureHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE
  delete<T>(path: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const secureHeaders = this.getHeadersWithToken(headers);
    return this._httpClient.delete<T>(`${this.baseUrl}/${path}`, { params, headers: secureHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  // Manejar errores en las peticiones HTTP
  private handleError(error: any): Observable<never> {
    let errorMensaje = `Código de error:${error.status}\n Descripción:${error.message}`;
    return throwError(() => new Error(errorMensaje));
  }
}
