import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrderService } from './order.service';
import { BehaviorSubject, from } from "rxjs";
import { ProductService } from "./product.service";
import { CartModelPublic } from "../Component/Models/cart.model";
import { CartModelServer } from "../Component/Models/cart.model";
import { productModelServer } from "../Component/Models/product.model";
import {NavigationExtras, Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class CartService {

  private serverUrl = environment.SERVER_URL;

  //Data variables to store the cart information in local storage
  private cartDataClient: CartModelPublic = { prodData: [{ inCart: 0, id: 0 }], total: 0 };

  //Data variables to store cart information on the server
  private cartDataServer: CartModelServer = {
    data: [{
      product: undefined,
      numInCart: 0
    }],
    total: 0
  };

  //Observables from components to the subscriber 

  cartTotal$ = new BehaviorSubject<number>(0);

  cartDataObs$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);



  constructor(private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartDataObs$.next(this.cartDataServer);

    //get information from local storage if exists
    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    //check if the info variable is null or has data in it 
    if (info !== null && info !== undefined && info.prodData[0].inCart !== 0) {
      //local storage isn't empty and  has some data in it 
      this.cartDataClient = info;

      //loop through each entry and put it into the cartDataSeverObject
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProdInfo: productModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.inCart;
            this.cartDataServer.data[0].product = actualProdInfo;
            // this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
            this.cartDataServer.data.push({
              numInCart: p.inCart,
              product: actualProdInfo
            });
            //this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartDataObs$.next({ ...this.cartDataServer });
        });
      });
    }

  }


  AddProductToCart(id: number, quantity?: number) {

    this.productService.getSingleProduct(id).subscribe((prod) => {
      /*1- If the cart is empty*/
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        //this.CalculateTotal();
        this.cartDataClient.prodData[0].inCart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({ ...this.cartDataServer });
        /* this.toast.success(`${prod.name} added to the cart.`, "Product Added", {
           timeOut: 1500,
           progressBar: true,
           progressAnimation: 'increasing',
           positionClass: 'toast-top-right'
         })*/
      }


      /*2-If the cart has some items*/
      else {
        let index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id); //-1 or positive value

        //a- If the is already in the cart:
        if (index !== -1) {

          if (quantity !== undefined && quantity <= prod.quantity) {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          } else {
            this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }
          this.cartDataClient.prodData[index].inCart = this.cartDataServer.data[index].numInCart;
        }
        //b- If that item is not in the cart
        else {
          this.cartDataServer.data.push({
            product: prod,
            numInCart: 1
          });
          this.cartDataClient.prodData.push({
            inCart: 1,
            id: prod.id
          });
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartDataObs$.next({ ...this.cartDataServer });
        }

      }

    });

  }

  UpdateCartItems(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];

    if (increase) {
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].inCart = data.numInCart;
      //Calcuate Total
      this.cartDataClient.total = this.cartDataServer.total;
      this.cartDataObs$.next({ ...this.cartDataServer });
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    } else {

      data.numInCart--;
      if (data.numInCart < 1) {
        // this.DeleteProductFromCart(index);
        this.cartDataObs$.next({ ...this.cartDataServer });
      } else {
        this.cartDataObs$.next({ ...this.cartDataServer });
        this.cartDataClient.prodData[index].inCart = data.numInCart;
        // this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  DeleteProductFromCart(index: number) {
    if (window.confirm('Are you sure you want to delete the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      // this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = { prodData: [{ inCart: 0, id: 0 }], total: 0 }; //Reset
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
      else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = { data: [{ product: undefined, numInCart: 0 }], total: 0 };
        this.cartDataObs$.next({ ...this.cartDataServer });
      } else {
        this.cartDataObs$.next({ ...this.cartDataServer });
      }
    }
    else{
      //If the user clicks cancel button
      return;
    }


  }
  private CalculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.product;
      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }
  CheckoutFromCart(userId: Number) {

    this.http.post(`${this.serverUrl}/orders/payment`, null).subscribe((res: { success: Boolean }) => {
      console.clear();

      if (res.success) {


        this.resetServerData();
        this.http.post(`${this.serverUrl}/  orders/new`, {
          userId: userId,
          products: this.cartDataClient.prodData
        }).subscribe((data: OrderConfirmationResponse) => {

          this.orderService.getSingleOrder(data.order_id).then(prods => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClient.total
                }
              };
             // this.spinner.hide().then();
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.cartDataClient = {prodData: [{inCart: 0, id: 0}], total: 0};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
              });
            }
          });

        })
      } else {
        //this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        /*this.toast.error(`Sorry, failed to book the order`, "Order Status", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })*/
      }
    })
  }

  private resetServerData() {
    this.cartDataServer = {
      data: [{
        product: undefined,
        numInCart: 0
      }],
      total: 0
    };
    this.cartDataObs$.next({...this.cartDataServer});
  }
}
interface OrderConfirmationResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [{
    id: string,
    numInCart: string
  }]
}