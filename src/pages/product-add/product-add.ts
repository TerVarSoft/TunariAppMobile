import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, Transfer } from 'ionic-native';

import _ from "lodash";

import { IProduct } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { SettingsService } from '../../services/settings.service';

@Component({
    selector: 'product-add',
    templateUrl: 'product-add.html',
    styles: ["product-add.scss"],
    providers: [ ProductsService ]    
})
export class ProductAddComponent implements OnInit {
    newProduct: IProduct;
    products: Array<IProduct>;
    categories: Array<string>;
    productProviders: Array<string>;
    invitationTypes: Array<string>;
    invitationsDetailsConfig: any;
    invitationDetails: any;
    invitationSizes: Array<string>;
    invitationGenres: Array<string>;
    properties: string = "general";
    imageUrl: string;
    error: string = "Error Message";

    ngOnInit() : void {
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
            properties: {},
            tags: []
        }
    }

    constructor(public navCtrl: NavController, private productsService: ProductsService,
        private navParams: NavParams, private alertCtrl: AlertController, private settings: SettingsService) {
        this.products = navParams.get('products');    

        this.settings.getSettings().subscribe(settings => {
            this.categories = _.map(_.find(settings, {'key': 'productCategories'}).value, "name");
            this.productProviders = _.find(settings, {'key': 'productProviders'}).value;
            this.invitationTypes = _.find(settings, {'key': 'invitationTypes'}).value;
            this.invitationsDetailsConfig = _.find(settings, {'key': 'invitationsDetails'}).value; 

            this.setDefaultValues();
            this.updatePropertiesOptions();
        });                             
    }

    updatePropertiesOptions() : void {
        console.log("helloo");
        var config = _.cloneDeep(this.invitationsDetailsConfig);
        this.invitationDetails = config['Default'];

        var invitationType = this.newProduct.properties.type;        
        _.mergeWith(this.invitationDetails, config[invitationType] || {}, 
            // Replace first array with second array when merging
            // Default behavior would mix the arrays, that is not what we want
            function(a, b) {
                if (_.isArray(a)) {
                    return b;
                };
            }
        );
        
        this.invitationSizes = this.invitationDetails['sizes'];
        this.invitationGenres = this.invitationDetails['genres'];        
    }

    setDefaultValues() {
        this.newProduct.category = this.categories[0]; 
        this.newProduct.properties = {};
        this.newProduct.properties.type = this.invitationTypes[0];         
        
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
        this.newProduct.name = _.toUpper(this.newProduct.name);
        this.newProduct.category = _.capitalize(this.newProduct.category);
        this.newProduct.sortTag = this.newProduct.category + this.newProduct.name;
        
        this.newProduct.tags.push(this.newProduct.name);       
        this.newProduct.tags.push(this.newProduct.category);       
        this.newProduct.tags.push(this.newProduct.provider); 

        if(this.newProduct.category === "Invitaciones") {                                             
            this.newProduct.tags.push(this.newProduct.properties.type);
            this.newProduct.tags.push(this.newProduct.properties.size);
            this.newProduct.tags.push(this.newProduct.properties.genre);

            var invitationNumber = this.getInvitationNumber();
            this.newProduct.sortTag = this.newProduct.properties.type + invitationNumber;
        }

        this.newProduct.tags = _.filter(this.newProduct.tags, function(tag) {
            return !_.isEmpty(tag);
        });
    }

    getInvitationNumber() : string {
        var nameParts = this.newProduct.name.split('-');

        var lastElement = _.last(nameParts);
        var isNum = /^\d+$/.test(lastElement);
        var number = "";

        if(isNum){
            number = lastElement;
        }
    
        return number;
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
