import { Component, OnInit } from '@angular/core';

import { PopoverController, NavParams } from 'ionic-angular';
import { ProductsService } from '../../services/products.service';

@Component({
  templateUrl: 'products-view-options.html'
})
export class ProductsViewOptionsComponent implements OnInit {
    priceTypes: Array<string>;
    sampleBookView: boolean = false;
    isSortByQuantity: boolean = false;
    selectedPriceType: string;
    parent: any;

    ngOnInit() {
        if (this.navParams.data) {
            this.priceTypes = this.navParams.data.priceTypes;
            this.parent = this.navParams.data.parent;
            this.sampleBookView = this.navParams.data.sampleBookView;
            this.selectedPriceType = this.navParams.data.selectedPriceType;
        }   
        this.isSortByQuantity = this.productsService.getIsSortByQuantity();     
    }

    constructor(private navParams: NavParams, private productsService: ProductsService) {}

    sampleViewClicked() {        
        this.parent.onChangeToSampleBookView(this.sampleBookView);        
    }

    sortByQuantityClicked() {
        this.productsService.setIsSortByQuantity(this.isSortByQuantity);
        this.parent.onSortByQuantityClicked();
    }

    priceTypeSelected() {
        this.parent.onSelectPriceType(this.selectedPriceType);
    }
}