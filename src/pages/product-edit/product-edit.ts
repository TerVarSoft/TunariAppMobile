import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
    selector: 'product-edit',
    templateUrl: 'product-edit.html'
})
export class ProductEditComponent {
    properties: string = "general";

    constructor(public navCtrl: NavController) {       
    }    

    save() {
        this.navCtrl.pop();
    }
}
