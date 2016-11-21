import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
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

  addProduct (newProduct: IProduct): Observable<IProduct> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.post(this.productsUrl, newProduct, options)
                      .map(this.extractElement)
                      .catch(this.handleError);
  }

  removeProduct (productId: string): Observable<IProduct> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.delete(this.productsUrl + "/" + productId, options)                      
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
    console.log("asdf");
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