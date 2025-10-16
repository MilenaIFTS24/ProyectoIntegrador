import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductTeaService {

  constructor(private _apiService: ApiService) { }

  
}
