import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { IProduct } from '../../models/product';
@Component({
    selector: 'product-edit',
    templateUrl: 'product-edit.html'
})
export class ProductEditComponent {
    properties: string = "general";
    product: IProduct;

    constructor(public navCtrl: NavController, private navParams: NavParams) {       
        this.product = navParams.get('product'); 
    }    

    save() {
        this.navCtrl.pop();
    }
}
