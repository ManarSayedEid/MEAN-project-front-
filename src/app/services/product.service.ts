import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { productModelServer } from '../Component/Models/product.model';
import {serverResponse} from '../Component/Models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;

  constructor(private http : HttpClient, private router : Router) { }


  /*To Fetch all products from backend*/

  getAllProducts(numberOfResults: number=10): Observable< serverResponse> {
    return this.http.get<serverResponse>(this.SERVER_URL + '/products', {
      params: {
        limit: numberOfResults.toString()
      }
    });
  }

  getAllProducts2(){
    console.log("dd")
    return this.http.get("https://shoppingcarttt.herokuapp.com/home/product")
  }

  //get Single Product from server

  getSingleProduct(id: number): Observable<productModelServer>{
    return this.http.get <productModelServer>(this.SERVER_URL + '/product' + id);
  }
  //Get product from one Catagory

  getProductsFromCategory(catName : string) : Observable <productModelServer []>{
    return this.http.get <productModelServer []>(this.SERVER_URL + 'products/category/' + catName);
  }
}
 
