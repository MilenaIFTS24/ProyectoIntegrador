import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private _httpClient: HttpClient) {
    console.log('API URL ACTUAL:', this.baseUrl);
  }

  private getHeaders(extraHeaders?: HttpHeaders): HttpHeaders {
    let headers = extraHeaders || new HttpHeaders();

    headers = headers.set('apikey', environment.supabaseKey);
    headers = headers.set('Authorization', `Bearer ${environment.supabaseKey}`);

    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Accept', 'application/json');

    return headers;
  }

  get<T>(path: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {

    let finalHeaders = this.getHeaders(headers);

    finalHeaders = finalHeaders.set(
      'Prefer',
      'return=representation'
    );

    return this._httpClient.get<T>(
      `${this.baseUrl}/${path}`,
      {
        params,
        headers: finalHeaders
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(path: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this._httpClient.post<T>(`${this.baseUrl}/${path}`, body, {
      params,
      headers: this.getHeaders(headers)
    }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(path: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this._httpClient.put<T>(`${this.baseUrl}/${path}`, body, {
      params,
      headers: this.getHeaders(headers)
    }).pipe(
      catchError(this.handleError)
    );
  }

  patch<T>(path: string, body: any): Observable<T> {
    return this._httpClient.patch<T>(`${this.baseUrl}/${path}`, body, {
      headers: this.getHeaders()
    });
  }

  delete<T>(path: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this._httpClient.delete<T>(`${this.baseUrl}/${path}`, {
      params,
      headers: this.getHeaders(headers)
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    // Si el error es 0, es que no llegó a internet o hay un problema de CORS
    let errorMensaje = error.status === 0
      ? 'No se pudo conectar con el servidor. Revisá tu conexión o la URL de la API.'
      : `Código de error: ${error.status}\nDescripción: ${error.error?.msg || error.message}`;

    console.error(error);
    return throwError(() => new Error(errorMensaje));
  }
}