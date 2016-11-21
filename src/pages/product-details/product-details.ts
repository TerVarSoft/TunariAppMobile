import { Component } from '@angular/core';
import { NavController, NavParams, AlertController  } from 'ionic-angular';

import { IProduct } from '../../models/product';
import { ProductEditComponent } from '../product-edit/product-edit';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'product-details',
    templateUrl: 'product-details.html',
    providers: [ ProductsService ]
})
export class ProductDetailsComponent {
    products: Array<{name: string}>;
    product: IProduct;

    constructor(public navCtrl: NavController, private navParams: NavParams, 
        public alertCtrl: AlertController, private productsService: ProductsService) {      
        this.product = navParams.get('product');         
    }

    delete() {
        let deletePrompt = this.alertCtrl.create({
        title: 'Borrar',
        message: "Estas seguro de que quieres borrar este producto?",
        buttons: [
            {
            text: 'Cancelar',
            handler: data => {
                console.log('Cancelado');
            }
            },
            {
            text: 'Borrar',
            handler: data => {
                console.log('Borrado');
                this.productsService.removeProduct(this.product._id)
                    .subscribe(() => { console.log('Borrado Exitoso! xxxx'); },
                        error =>  console.log(error),
                        () => {
                             console.log('Borrado Exitoso!');
                             this.navCtrl.pop();
                        });                
            }
            }
        ]
        });
        deletePrompt.present();
    }

    edit() {
        this.navCtrl.push(ProductEditComponent,{
            product: this.product
        });
    }
}
