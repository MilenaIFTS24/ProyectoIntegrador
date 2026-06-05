import { Product } from './product.model';

export type OfferType = 'percentage' | 'fixed' | 'quantity';

export interface Offer {
    id?: string;
    title: string;
    type: OfferType;      // Solo permite: 'fixed', 'percentage' o 'quantity'
    value: number;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;

    Products?: Product[];
}