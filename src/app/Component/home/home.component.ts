import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse } from 'http';
import { Command } from 'protractor';
import { ProductService } from 'src/app/services/product.service';
import { productModelServer } from '../Models/product.model';
import { serverResponse } from '../Models/product.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private productService :ProductService,

              private router : Router) { }
  products:productModelServer[] = [];


  ngOnInit() {
    /*this.productService.getAllProducts(8).subscribe((prods : ServerResponse)=> {
        this.products = this.products;
    });*/
    // this.productService.getAllProducts().subscribe((prods: serverResponse ) => {
    //   this.products = prods.products;
    //   console.log(this.products);
    // });
    this.getProducts();

    this.getAllProducts2()
  }
  getProducts(){
    this.productService.getAllProducts().subscribe((prods: serverResponse )=>{
      this.products =prods['data'].products;

      console.log(prods['data'].products);
    },err=>{
      console.log(err);
  
    })
  }
  selectProduct(id : Number){
    this.router.navigate(['/product',id]).then();
  }

  productss
  getAllProducts2(){
    this.productService.getAllProducts2().subscribe(
      (products)=>{
        console.log(products)
       this.productss = products     },
      (err)=>{
        console.log(err)
      }
    )
  }
}
