import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';
import { URLSearchParams, Jsonp } from '@angular/http';
import _ from "lodash";

import { IProduct } from '../models/product';

@Injectable()
export class ProductsService {
  //private productsUrl = 'http://servertunari.herokuapp.com/api/products';
  private productsUrl = 'http://192.168.1.39:8000/api/products';  

  constructor (private http: Http, private jsonp: Jsonp) {}

  search (tags: string, page: number) {     
      let params: URLSearchParams = new URLSearchParams();

      if(!_.isEmpty(tags)) { params.set('tags', tags) };
      if(page) { params.set('page', page.toString()) };

      params.set('queryLimit', '7');

      return this.http
                  .get(this.productsUrl, { search: params })
                  .map(this.extractData)
                  .catch(this.handleError);
  }

  /*getProducts (): Observable<IProduct[]> {
      return this.http.get(this.productsUrl)
                .map(this.extractData)
                .catch(this.handleError);
  }*/

  addProduct (newProduct: IProduct): Observable<IProduct> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.post(this.productsUrl, newProduct, options)
                      .map(this.extractElement)
                      .catch(this.handleError);
  }

  updateProduct (productId: string, product: IProduct): Observable<IProduct> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.put(this.productsUrl + "/" + productId, product, options)
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