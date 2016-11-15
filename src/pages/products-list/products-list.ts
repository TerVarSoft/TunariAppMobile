import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { ProductDetailsComponent } from '../product-details/product-details';
import { ProductEditComponent } from '../product-edit/product-edit';
import { ProductImageComponent } from '../product-image/product-image';

@Component({
    selector: 'products-list',
    templateUrl: 'products-list.html'
})
export class ProductsListComponent {
    products: Array<{name: string}>;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
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

    viewImage(event, product) {
        console.log("asdf");
        let modal = this.modalCtrl.create(ProductImageComponent);   
        modal.present();             
    }

    viewDetails(event, product) {
        this.navCtrl.push(ProductDetailsComponent, {
            product: product
        });
    }

    createProduct() {
        this.navCtrl.push(ProductEditComponent);
    }
}
