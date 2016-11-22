import { Component } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { FormControl } from '@angular/forms';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import _ from "lodash";

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
    products: Array<IProduct>;
    productsRes : IProduct[];
    errorMessage: string;
    term = new FormControl();
    page: number = 1;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private productsService: ProductsService) {            
        this.term.valueChanges
             .debounceTime(100)
             //.distinctUntilChanged()
             .switchMap(term => this.productsService.search(term, 1))
             .subscribe(products => this.products = products);        
        this.term.reset();              
    }    

    pullNextPage(infiniteScroll) {
        console.log('pulling page ' + this.page + '...');

        this.page ++;
        this.productsService.search(this.term.value, this.page)
            .subscribe( 
                products => this.products.push(...products),
                null,
                () => {
                    infiniteScroll.complete();
                    console.log('Finished pulling page');
                });
    }

    viewImage(product) {
        let modal = this.modalCtrl.create(ProductImageComponent);   
        modal.present();             
    }

    viewDetails(product) {
        this.navCtrl.push(ProductDetailsComponent, {
            product: product,
            products: this.products
        });
    }

    createProduct() {        
        this.navCtrl.push(ProductAddComponent, {
            products: this.products
        });       
    }

    getProductPrice(product: IProduct) {
        let filterTag = product.category == "Libreria" ? "Unidad" : "Paquete";
        let price = _.find(product.prices, function(price) {
            return (price.type == filterTag && price.value) || price.value;
        });

        return (price && price.value) ? price.value + ' Bs. / ' + price.type : "";
    }

    getProductLocation(product: IProduct) {
        let warehouseString = "Deposito";
        let location = _.find(product.locations, function(location) {
            return (location.type == warehouseString && location.value) || location.value;
        });

        return (location && location.value) ? location.value + ' / ' + location.type : "";
    }
}
