import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProductDetailsComponent } from '../product-details/product-details';

@Component({
    selector: 'products-list',
    templateUrl: 'products-list.html'
})
export class ProductsListComponent {
    products: Array<{name: string}>;

    constructor(public navCtrl: NavController) {
        this.products = [
            {
                name: 'ME-001'
            },
            {
                name: 'ME-006'
            },
            {
                name: 'ME-007'
            },
            {
                name: 'ME-008'
            },
            {
                name: 'ME-006'
            },
            {
                name: 'ME-007'
            },
            {
                name: 'ME-009'
            },
            {
                name: 'ME-010'
            },
            {
                name: 'ME-007'
            },
            {
                name: 'ME-008'
            },
            {
                name: 'ME-006'
            },
            {
                name: 'ME-007'
            }
        ];
    }

    viewDetails(event, product) {
        this.navCtrl.push(ProductDetailsComponent, {
            product: product
        });
    }
}
