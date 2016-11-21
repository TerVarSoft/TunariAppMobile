import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';

import { ProductDetailsComponent } from '../product-details/product-details';
import { ProductAddComponent } from '../product-add/product-add';
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
        this.productsService.getProducts()
                     .subscribe(
                       products => {
                           this.products = products;
                           loader.present();                           
                        } ,
                       error =>  this.errorMessage = <any>error,
                       () => loader.dismiss());
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
        this.navCtrl.push(ProductAddComponent);       
    }
}
