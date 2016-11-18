import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { IProduct } from '../../models/product';
@Component({
    selector: 'product-add',
    templateUrl: 'product-add.html'
})
export class ProductAddComponent {
    newProduct: IProduct;
    properties = "General";

    constructor(public navCtrl: NavController) {
        this.newProduct = {
            name: ""
        }                
    }    

    save() {
        this.navCtrl.pop();
    }
}
