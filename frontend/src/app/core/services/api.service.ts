import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://casa-de-te.up.railway.app/api';

  constructor(private _httpClient: HttpClient) { }

  private getHeadersWithToken(customHeaders?: HttpHeaders): HttpHeaders {
    // 1. Empezar con los headers personalizados que envíe el servicio (si existen)
    let headers = customHeaders || new HttpHeaders();

    // 2. Recuperar el token de tu autenticación (ajustá 'token' al nombre exacto de tu localStorage)
    const token = localStorage.getItem('token'); 

    // 3. Si el token existe y las cabeceras no tienen ya una autorización, se la agrega
    if (token && !headers.has('Authorization')) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  get<T>(path: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const secureHeaders = this.getHeadersWithToken(headers);
    return this._httpClient.get<T>(`${this.baseUrl}/${path}`, { params, headers: secureHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(path: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const secureHeaders = this.getHeadersWithToken(headers);
    return this._httpClient.post<T>(`${this.baseUrl}/${path}`, body, { params, headers: secureHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(path: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const secureHeaders = this.getHeadersWithToken(headers);
    return this._httpClient.put<T>(`${this.baseUrl}/${path}`, body, { params, headers: secureHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  patch<T>(path: string, body: any): Observable<T> {
    const secureHeaders = this.getHeadersWithToken();
    return this._httpClient.patch<T>(`${this.baseUrl}/${path}`, body, { headers: secureHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(path: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const secureHeaders = this.getHeadersWithToken(headers);
    return this._httpClient.delete<T>(`${this.baseUrl}/${path}`, { params, headers: secureHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para manejar errores en las peticiones HTTP
  private handleError(error: any): Observable<never> {
    let errorMensaje = `Código de error:${error.status}\n Descripción:${error.message}`;
    return throwError(() => new Error(errorMensaje));
  }
}
