import { Component, OnInit } from '@angular/core';

import { PopoverController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'products-view-options.html'
})
export class ProductsViewOptionsComponent implements OnInit {
    priceTypes: Array<string>;
    sampleBookView: boolean = false;
    selectedPriceType: string;
    parent: any;

    ngOnInit() {
        if (this.navParams.data) {
            this.priceTypes = this.navParams.data.priceTypes;
            this.parent = this.navParams.data.parent;
            this.selectedPriceType = this.navParams.data.selectedPriceType;
        }
    }

    constructor(private navParams: NavParams) {}

    sampleViewClicked(){        
        this.parent.onChangeToSampleBookView(this.sampleBookView);
    }

    priceTypeSelected() {
        this.parent.onSelectPriceType(this.selectedPriceType);
    }
}