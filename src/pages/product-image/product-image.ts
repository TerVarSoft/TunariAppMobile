import { Component } from '@angular/core';
import { ViewController, AlertController, NavParams  } from 'ionic-angular';

import { IProduct } from '../../models/product';
import { ProductInfoService } from '../../services/product-info.service';

@Component({
    selector: 'product-image',
    templateUrl: 'product-image.html'
})
export class ProductImageComponent {
    product: IProduct;

    constructor(public viewCtrl: ViewController, public alertCtrl: AlertController, private _navParams: NavParams,
                private productInfo: ProductInfoService) {       
        this.product = this._navParams.get("product");  
    }

    getProductImage() {
        let imgUrl = this.productInfo.getProductImage(this._navParams.get("product"), "-L"); 
        return imgUrl;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
