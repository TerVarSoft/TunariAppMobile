import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';

import { ProductDetailsComponent } from '../product-details/product-details';
import { ProductEditComponent } from '../product-edit/product-edit';
import { ProductImageComponent } from '../product-image/product-image';
import { IProduct } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-list',
    templateUrl: 'products-list.html',
    providers: [ ProductsService ]
})
export class ProductsListComponent {
    products: Array<{name: string}>;
    productsRes : IProduct[];
    errorMessage: string;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private productsService: ProductsService) {        

        let loader = this.loadingCtrl.create({
            content: "Cargado los productos...",
        });
        loader.present();
        this.productsService.getProducts()
                     .subscribe(
                       products => {
                           this.products = products;
                           loader.dismiss()
                        } ,
                       error =>  this.errorMessage = <any>error);
    }

    viewImage(product) {
        console.log("asdf");
        let modal = this.modalCtrl.create(ProductImageComponent);   
        modal.present();             
    }

    viewDetails(product) {
        this.navCtrl.push(ProductDetailsComponent, {
            product: product
        });
    }

    createProduct() {
        this.navCtrl.push(ProductEditComponent);
    }
}
