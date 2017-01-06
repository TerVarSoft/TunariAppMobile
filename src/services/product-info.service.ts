import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';
import { URLSearchParams, Jsonp } from '@angular/http';
import _ from "lodash";

import { IProduct } from '../models/product';
import { SettingsService } from '../services/settings.service';

@Injectable()
export class ProductInfoService {  
  private imgServer: string;   

  constructor(private http: Http, private jsonp: Jsonp, private settingsService: SettingsService) {
      this.settingsService.getSettings()
          .subscribe(settings => {
              this.imgServer = _.find(settings, {'key': 'imgServer'}).value;
          });                
  } 

  getProductImage(product: IProduct, suffix: string) {
        let imgUrl = ""        
        if(product && product.name && !_.isEmpty(product.category))
        {
            if(product.category === 'Invitaciones' && !_.isEmpty(product.properties)) {                
                imgUrl= this.imgServer + "/" +
                    product.category + "/" +
                    (product.properties.type || '' )+ "/" +
                    product.name + suffix +".jpg";
            }
            else {
                imgUrl= this.imgServer + "/" +
                    product.category + "/" +                    
                    product.name + "-L" +".jpg";
            }            
        }
        else {
            imgUrl= "images/tunari-logo-1.png"
        }

        return imgUrl;
    }
}