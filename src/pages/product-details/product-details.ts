import { Component } from '@angular/core';

import { NavController, AlertController  } from 'ionic-angular';

@Component({
    selector: 'product-details',
    templateUrl: 'product-details.html'
})
export class ProductDetailsComponent {
    products: Array<{name: string}>;

    constructor(public navCtrl: NavController, public alertCtrl: AlertController) {       
    }

    delete() {
        let deletePrompt = this.alertCtrl.create({
        title: 'Borrar',
        message: "Estas seguro de que quieres borrar este producto?",
        buttons: [
            {
            text: 'Cancelar',
            handler: data => {
                console.log('Cancelado');
            }
            },
            {
            text: 'Borrar',
            handler: data => {
                console.log('Borrado');
                this.navCtrl.pop();
            }
            }
        ]
        });
        deletePrompt.present();
    }

    save() {
        this.navCtrl.pop();
    }
}
