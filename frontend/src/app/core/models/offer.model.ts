import { Product } from './product.model';

export type OfferType = 'percentage' | 'fixed' | 'quantity';

// Modelo de oferta
export interface Offer {
    id?: string;
    title: string;
    type: OfferType;
    value: number;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;

    Products?: Product[];
}