import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { IProduct } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'product-add',
    templateUrl: 'product-add.html',
    providers: [ ProductsService ]
})
export class ProductAddComponent {
    newProduct: IProduct;
    properties = "general";

    constructor(public navCtrl: NavController, private productsService: ProductsService) {
        this.newProduct = {
            name: "",
            category: "",
            quantity: 0
        }                
    }

    save() {
        this.productsService.addProduct(this.newProduct)
            .subscribe(
                product => {
                    console.log(product);                           
                },
                error =>  console.log(error));

        this.navCtrl.pop();
    }
}
