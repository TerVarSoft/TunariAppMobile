import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';
import { URLSearchParams, Jsonp } from '@angular/http';
import _ from "lodash";

@Injectable()
export class SettingsService {
  //private productsUrl = 'http://servertunari.herokuapp.com/api/products';
  private settingsUrl = 'http://192.168.1.39:8000/api/settings';  

  constructor (private http: Http, private jsonp: Jsonp) {}

  getSettings () {     

      return this.http
                  .get(this.settingsUrl)
                  .map(this.extractData)
                  .catch(this.handleError);
  }  

  private extractData(res: Response) {
    let body = res.json();
    return body.data.items || { };
  }

  private extractElement(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private handleError (error: Response | any) {
      // In a real world app, we might use a remote logging infrastructure
      let errMsg: string;
      if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } else {
        errMsg = error.message ? error.message : error.toString();
      }
      console.error(errMsg);
      return Observable.throw(errMsg);
  }
}