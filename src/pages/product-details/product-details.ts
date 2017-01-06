import { Component } from '@angular/core';
import { NavController, NavParams, AlertController  } from 'ionic-angular';
import _ from "lodash";

import { IProduct } from '../../models/product';
import { ProductAddComponent } from '../product-add/product-add';
import { ProductsService } from '../../services/products.service';
import { ProductInfoService } from '../../services/product-info.service';

@Component({
    selector: 'product-details',
    templateUrl: 'product-details.html',
    providers: [ ProductsService ]
})
export class ProductDetailsComponent {
    products: Array<IProduct>;
    product: IProduct;
    showPrices: boolean;
    showLocations: boolean;
    showTags: boolean;

    constructor(public navCtrl: NavController, private navParams: NavParams, 
        public alertCtrl: AlertController, private productsService: ProductsService,
        private productInfo: ProductInfoService) {      
        this.product = navParams.get('product');     
        this.products = navParams.get('products');         
    }

    ionViewWillEnter() {
        this.showPrices = _.some(this.product.prices, function(price) { return price.value});
        this.showLocations = _.some(this.product.locations, function(location) { return location.value});
        this.showTags = this.product.tags.length > 0;  
    }

    getProductImage() {
        let imgUrl = this.productInfo.getProductImage(this.product, "-S"); 
        return imgUrl;
    }

    onSave(product: IProduct) {
        this.productsService.updateProduct(product._id, product)
            .subscribe(() => { },
                error =>  console.log(error),
                () => {
                        console.log('Actualizado Exitosamente!');
                        let index = _.indexOf(this.products, this.product);
                        this.products.splice(index, 1, product);
                        this.product = product;
                        this.navCtrl.pop();
                });
    }

    delete() {
        let deletePrompt = this.alertCtrl.create({
        title: 'Borrar',
        message: "Estas seguro de que quieres borrar este producto?",
        buttons: [
            {
            text: 'Cancelar',            
            },
            {
            text: 'Borrar',
            handler: data => {

                this.productsService.removeProduct(this.product._id)
                    .subscribe(null,
                        error =>  console.log(error),
                        () => {
                             console.log('Borrado Exitoso!');
                             _.pull(this.products, this.product);
                             this.navCtrl.pop();
                        });                
            }
            }
        ]
        });
        deletePrompt.present();
    }

    edit() {
        /*this.navCtrl.push(ProductEditComponent,{
            product: this.product
        });*/
        this.navCtrl.push(ProductAddComponent, {
            products: this.products,
            product: this.product,
            parent: this
        });
    }
}
