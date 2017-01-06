import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, ModalController, LoadingController, PopoverController } from 'ionic-angular';
import _ from "lodash";

import { ProductDetailsComponent } from '../product-details/product-details';
import { ProductAddComponent } from '../product-add/product-add';
import { ProductImageComponent } from '../product-image/product-image';
import { IProduct } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { SettingsService } from '../../services/settings.service';
import { ProductInfoService } from '../../services/product-info.service';
import { ProductsViewOptionsComponent } from '../products-view-options/products-view-options';

@Component({
    selector: 'products-list',
    templateUrl: 'products-list.html',
    styles: ['products-list.scss'],
    providers: [ ProductsService, SettingsService ]    
})
export class ProductsListComponent {
    imgServer: string;
    products: Array<IProduct>;
    productsRes : IProduct[];
    priceTypes: Array<string>;
    errorMessage: string;
    term = new FormControl();
    page: number = 1;
    sampleBookView: boolean = false;
    selectedPriceType: string = "Unidad";    

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, 
            private productsService: ProductsService, private settingsService: SettingsService,
            private productInfo: ProductInfoService, private popoverCtrl: PopoverController) {
        this.settingsService.getSettings()
            .subscribe(settings => {
                    this.priceTypes = _.find(settings, {'key': 'priceTypes'}).value;
                    this.imgServer = _.find(settings, {'key': 'imgServer'}).value;
                }            
            );        

        this.term.valueChanges
            .debounceTime(100)
            //.distinctUntilChanged()
            .switchMap(term => this.productsService.search(term, 1))
            .subscribe(products => {
                this.page = 1;
                this.products = products;
            });        
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
        let modal = this.modalCtrl.create(ProductImageComponent, {
            product: product
        });   
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
            products: this.products,
            product: {},
            parent: this
        });       
    }

    getProductPrice(product: IProduct) {
        let filterTag = this.selectedPriceType;
        let price = _.find(product.prices, function(price) {
            return (price.type == filterTag && price.value);
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

    getProductImage(product: IProduct) {
        let imgUrl = this.productInfo.getProductImage(product, "-S"); 
        return imgUrl;   
    }

    openViewOptions(ev) {

        let popover = this.popoverCtrl.create(ProductsViewOptionsComponent, {
            priceTypes: this.priceTypes,
            selectedPriceType: this.selectedPriceType,
            parent: this
        });

        popover.present({
            ev: ev
        });
    }

    onChangeToSampleBookView(value: boolean) {
        this.sampleBookView = value;
    }

    onSelectPriceType(selectedPriceType: string) {
        this.selectedPriceType = selectedPriceType;
    }

    onSave(product: IProduct) {
        this.productsService.addProduct(product)
            .subscribe(
                product => {
                    this.products.unshift(product);
                    this.navCtrl.pop();                           
                },
                error =>  console.log(error));    
    }
}
