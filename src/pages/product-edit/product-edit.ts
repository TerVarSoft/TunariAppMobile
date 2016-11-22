import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import _ from "lodash";

import { IProduct } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'product-edit',
    templateUrl: 'product-edit.html',
    providers: [ ProductsService ]
})
export class ProductEditComponent {
    properties: string = "general";
    product: IProduct;
    products: Array<IProduct>;

    constructor(public navCtrl: NavController, private navParams: NavParams, private productsService: ProductsService, private alertCtrl: AlertController) {       
        this.product = navParams.get('product'); 
    }    

    save() {
        this.prepareBeforeSave();

        this.productsService.updateProduct(this.product._id, this.product)
                    .subscribe(() => { },
                        error =>  console.log(error),
                        () => {
                             console.log('Actualizado Exitosamente!');
                             this.navCtrl.pop();
                        });
    }

    prepareBeforeSave() {
        this.product.name = this.product.name.toUpperCase();
        this.product.category = _.capitalize(this.product.category);
        this.product.sortTag = this.product.category + this.product.name;

        let isNameInTags: boolean = _.includes(this.product.tags, this.product.name);
        let isCategoryInTags: boolean = _.includes(this.product.tags, this.product.category);

        if(!isNameInTags) { this.product.tags.push(this.product.name)};
        if(!isCategoryInTags) { this.product.tags.push(this.product.category)};
    }

    addTag() {
        let addTagAlert = this.alertCtrl.create({
        title: 'Agregar Etiqueta',
        message: "Introduce la nueva etiqueta",
        inputs: [
            {
            name: 'tag',
            placeholder: 'Nueva etiqueta'
            },
        ],
        buttons: [
            {
            text: 'Cancel',
            handler: data => {
                console.log('Cancel add tag');
            }
            },
            {
            text: 'Save',
            handler: data => {
                this.product.tags.push(data.tag);
            }
            }
        ]
        });
        addTagAlert.present();
    }

    removeTag(tag) {
        _.pull(this.product.tags, tag);
    }
}
