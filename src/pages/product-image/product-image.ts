import { Component } from '@angular/core';

import { ViewController, AlertController  } from 'ionic-angular';

@Component({
    selector: 'product-image',
    templateUrl: 'product-image.html'
})
export class ProductImageComponent {
    products: Array<{name: string}>;

    constructor(public viewCtrl: ViewController, public alertCtrl: AlertController) {       
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
                this.viewCtrl.dismiss();
            }
            }
        ]
        });
        deletePrompt.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
