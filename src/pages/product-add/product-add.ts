import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, Transfer } from 'ionic-native';

import _ from "lodash";

import { IProduct } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'product-add',
    templateUrl: 'product-add.html',
    styles: ["product-add.scss"],
    providers: [ ProductsService ]    
})
export class ProductAddComponent {
    newProduct: IProduct;
    products: Array<IProduct>;
    properties: string = "general";
    imageUrl: string;
    error: string = "Error Message";

    constructor(public navCtrl: NavController, private productsService: ProductsService,
        private navParams: NavParams, private alertCtrl: AlertController) {
        this.products = navParams.get('products');    
        
        this.newProduct = {
            name: "",
            category: "Libreria",
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

    takePicture() {
        console.log("heloo");
               

        Camera.getPicture({destinationType: Camera.DestinationType.DATA_URL}).then((imageData) => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64:
                this.imageUrl = 'data:image/jpeg;base64,' + imageData;
                /*this.platform.ready().then(() => {
                    const fileTransfer = new Transfer(); 

                     var fileTransferOptions = {
                        fileKey: 'file',
                        fileName: 'name.jpg',
                        trustAllHosts: true
                    };

                    fileTransfer.upload(this.imageUrl, encodeURI("https://servertunari.herokuapp.com/images/"), fileTransferOptions)
                        .then((data) => {
                            this.error = "success!" + data;
                            // success
                        }, (err) => {
                            this.error = "error" + err.code + err.source + err.target;
                            // error
                        })
                });*/
               
            
            }, (err) => {
            // Handle error
        });        
    }

    upload() {
        /*this.platform.ready().then(() => {
            const tileTransfer = new Transfer();
            this.imageUrl = 'http://www.nice.com/PublishingImages/Career%20images/J---HR_Page-4st-strip-green-hair%20(2).png?RenditionID=-1';

                var fileTransferOptions = {
                    fileKey: 'file',
                    fileName: 'name.jpg'
                };

                tileTransfer.upload(this.imageUrl, "https://servertunari.herokuapp.com/images/", fileTransferOptions)
                    .then((data) => {
                        // success
                    }, (err) => {
                        // error
                    })
        });*/
    };
}
