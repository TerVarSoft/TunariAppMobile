import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, Transfer } from 'ionic-native';

import _ from "lodash";

import { IProduct } from '../../models/product';
import { IPrice } from '../../models/price';
import { ILocation } from '../../models/location';
import { ProductsService } from '../../services/products.service';
import { SettingsService } from '../../services/settings.service';
import { ProductInfoService } from '../../services/product-info.service'; 

@Component({
    selector: 'product-add',
    templateUrl: 'product-add.html',
    styles: ["product-add.scss"],
    providers: [ ProductsService ]    
})
export class ProductAddComponent {
    product: IProduct;
    products: Array<IProduct>;
    categories: Array<string>;
    productProviders: Array<string>;
    invitationTypes: Array<string>;
    invitationsDetailsConfig: any;
    invitationDetails: any;
    invitationSizes: Array<string>;
    invitationGenres: Array<string>;
    priceTypes: Array<string>;
    locationTypes: Array<string>;
    properties: string = "general";
    imageUrl: string;
    error: string = "Error Message";
    originalName = "";
    parent: any;    

    constructor(public navCtrl: NavController, private productsService: ProductsService,
        private navParams: NavParams, private alertCtrl: AlertController, private settings: SettingsService,
        private productInfo: ProductInfoService) {
        this.products = navParams.get('products');   
        this.product = navParams.get('product');
        this.originalName = this.product.name;
        this.parent = navParams.get('parent');

        this.settings.getSettings().subscribe(settings => {
            this.categories = _.map(_.find(settings, {'key': 'productCategories'}).value, "name");
            this.productProviders = _.find(settings, {'key': 'productProviders'}).value;
            this.invitationTypes = _.find(settings, {'key': 'invitationTypes'}).value;
            this.invitationsDetailsConfig = _.find(settings, {'key': 'invitationsDetails'}).value; 
            this.priceTypes = _.find(settings, {'key': 'priceTypes'}).value;
            this.locationTypes = _.find(settings, {'key': 'locationTypes'}).value;

            this.setDefaultValues();
            this.updatePropertiesOptions();
        });                             
    }

    updatePropertiesOptions() : void {        
        var config = _.cloneDeep(this.invitationsDetailsConfig);
        this.invitationDetails = config['Default'];

        var invitationType = this.product.properties.type;        
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
        this.product.category = this.product.category || this.categories[0]; 
        this.product.properties = this.product.properties || {};
        this.product.prices = this.product.prices || [];
        this.product.locations = this.product.locations || [];
        this.product.tags = this.product.tags || [];

        if(this.product.category === "Invitaciones") {
            this.product.properties.type = this.product.properties.type || this.invitationTypes[0];
        }                         
    }

    save() {
        this.prepareBeforeSave();
        this.parent.onSave(this.product);            
    }    

    prepareBeforeSave() {
        this.product.name = _.toUpper(this.product.name);
        //this.product.category = _.capitalize(this.product.category);
        this.product.sortTag = this.product.category + this.product.name;

        this.product.tags = _.difference(this.product.tags, _.intersection(this.product.tags, this.categories));
        this.product.tags = _.difference(this.product.tags, _.intersection(this.product.tags, this.productProviders));              
        _.pull(this.product.tags, this.originalName);
        
        this.product.tags.push(this.product.name);       
        this.product.tags.push(this.product.category);       
        this.product.tags.push(this.product.provider); 

        if(this.product.category === "Invitaciones") {      
            this.product.tags = _.difference(this.product.tags, _.intersection(this.product.tags, this.invitationTypes));
            this.product.tags = _.difference(this.product.tags, _.intersection(this.product.tags, this.invitationSizes));
            this.product.tags = _.difference(this.product.tags, _.intersection(this.product.tags, this.invitationGenres));

            this.product.tags.push(this.product.properties.type);
            this.product.tags.push(this.product.properties.size);
            this.product.tags.push(this.product.properties.genre);

            var invitationNumber = this.getInvitationNumber();
            this.product.sortTag = this.product.properties.type + invitationNumber;
        }

        this.product.tags = _.filter(this.product.tags, function(tag) {
            return !_.isEmpty(tag);
        });
    }

    getInvitationNumber() : string {
        var nameParts = this.product.name.split('-');

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

    addPrice() : void {
        let priceTypeAlert = this.alertCtrl.create();
        priceTypeAlert.setTitle('Tipo de precio');

        _.each(this.priceTypes, function(priceType) {
            priceTypeAlert.addInput({
                type: 'radio',
                label: priceType,
                value: priceType,                
            });
        });

        priceTypeAlert.addButton('Cancel');
        priceTypeAlert.addButton({
            text: 'OK',
            handler: priceType => {
                let priceAlert = this.alertCtrl.create({
                    title: 'Precio de ' + priceType,
                    message: "Precio en Bolivianos y Cantidad del paquete",
                    inputs: [
                        {
                            name: 'price',
                            placeholder: 'Precio'
                        }
                    ],
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: 'OK',
                            handler: result => {
                                let newPrice: IPrice = {};
                                newPrice.type = priceType;
                                newPrice.value = result.price;
                                newPrice.quantity = result.quantity || 1;
                                this.product.prices.unshift(newPrice);
                            }
                        }
                    ]
                });

                if(_.includes(priceType, "Paquete")) {
                    priceAlert.addInput({                        
                        name: 'quantity',
                        placeholder: 'Cantidad del paquete'                        
                    });
                }

                priceAlert.present();
            }            
        });
        priceTypeAlert.present();        
    }

    removePrice(price) {
        _.pull(this.product.prices, price);
    }

    addLocation() : void {
        let locationTypeAlert = this.alertCtrl.create();
        locationTypeAlert.setTitle('Tipo de ubicacion');

        _.each(this.locationTypes, function(locationType) {
            locationTypeAlert.addInput({
                type: 'radio',
                label: locationType,
                value: locationType,                
            });
        });

        locationTypeAlert.addButton('Cancel');
        locationTypeAlert.addButton({
            text: 'OK',
            handler: locationType => {
                let locationAlert = this.alertCtrl.create({
                    title: 'Ubicacion en ' + locationType,
                    message: "Ubicacion",
                    inputs: [
                        {
                            name: 'location',
                            placeholder: 'Ubicacion'
                        }
                    ],
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: 'OK',
                            handler: result => {
                                let newLocation: ILocation = {};
                                newLocation.type = locationType;
                                newLocation.value = result.location;

                                this.product.locations.unshift(newLocation);
                            }
                        }
                    ]
                });

                locationAlert.present();
            }            
        });
        locationTypeAlert.present();        
    }

    removeLocation(location) {
        _.pull(this.product.locations, location);
    }

    getProductImage() {
        let imgUrl = this.productInfo.getProductImage(this.product, "-S"); 
        return imgUrl;
    }

    takePicture() {        
               

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
