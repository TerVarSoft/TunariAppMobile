import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
    selector: 'product-details',
    templateUrl: 'product-details.html'
})
export class ProductDetailsComponent {
    products: Array<{name: string}>;

    constructor(public navCtrl: NavController) {       
    }
}
