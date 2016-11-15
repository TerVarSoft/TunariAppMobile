import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { IProduct } from '../models/product';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class ProductsService {
  private productsUrl = 'http://servertunari.herokuapp.com/api/products';  

  constructor (private http: Http) {}

  getProducts (): Observable<IProduct[]> {
      console.log("hello");
    return this.http.get(this.productsUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data.items || { };
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