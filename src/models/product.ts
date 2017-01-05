import { IPrice } from './price';
import { ILocation } from './location';

export interface IProduct {
    _id?: string;
    name: string;
    category: string;
    quantity?: number;
    prices: Array<IPrice>;
    locations: Array<ILocation>;
    tags: Array<string>;
    sortTag?: string; 
    properties?: any;
}