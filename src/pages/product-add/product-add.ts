import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import _ from "lodash";

import { IProduct } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'product-add',
    templateUrl: 'product-add.html',
    providers: [ ProductsService ]
})
export class ProductAddComponent {
    newProduct: IProduct;
    products: Array<IProduct>;
    properties: string = "general";

    constructor(public navCtrl: NavController, private productsService: ProductsService, private navParams: NavParams, private alertCtrl: AlertController) {
        this.products = navParams.get('products');    
        
        this.newProduct = {
            name: "",
            category: "",
            prices: [
                {
                    type:"Paquete"
                },
                {
                    type:"Unidad"
                },
                {
                    type:"Paquete Especial"
                },
                {
                    type:"Unidad Especial"
                }
            ],
            locations: [
                {
                    type:"Deposito"
                },
                {
                    type:"Tienda"
                }                
            ],
            tags: []
        }
             
    }

    save() {       
        this.prepareBeforeSave();

        this.productsService.addProduct(this.newProduct)
            .subscribe(
                product => {
                    console.log(product);
                    this.products.unshift(product);
                    this.navCtrl.pop();                           
                },
                error =>  console.log(error));        
    }    

    prepareBeforeSave() {
        this.newProduct.name = this.newProduct.name.toUpperCase();
        this.newProduct.category = _.capitalize(this.newProduct.category);
        this.newProduct.sortTag = this.newProduct.category + this.newProduct.name;
        
        if(!_.isEmpty(this.newProduct.name)) { this.newProduct.tags.push(this.newProduct.name) };
        if(!_.isEmpty(this.newProduct.category)) { this.newProduct.tags.push(this.newProduct.category) };
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
                this.newProduct.tags.push(data.tag);
            }
            }
        ]
        });
        addTagAlert.present();
    }

    removeTag(tag) {
        _.pull(this.newProduct.tags, tag);
    }
}
