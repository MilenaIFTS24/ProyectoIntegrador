import { inject, Injectable } from '@angular/core';
import { Offer } from '../models/offer.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private api = inject(ApiService);
  private path = 'offers';

  createOfferService(offer: Omit<Offer, 'id'>): Observable<Offer> {
    return this.api.post<Offer>(this.path, offer);
  }

  findAllOffersService(): Observable<Offer[]> {
    return this.api.get<Offer[]>(this.path);
  }

  findOfferByIdService(id: string): Observable<Offer> {
    return this.api.get<Offer>(`${this.path}/${id}`);
  }

  updateOfferService(offer: Offer): Observable<Offer> {
    return this.api.put<Offer>(`${this.path}/${offer.id}`, offer);
  }

  deleteOfferService(id: string): Observable<any>{
    return this.api.delete(`${this.path}/${id}`);
  }

}
