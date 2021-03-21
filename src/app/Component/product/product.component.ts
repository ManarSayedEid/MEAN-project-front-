import { Component, OnInit } from '@angular/core';
import {ProductService}from './../../services/product.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private product:ProductService) { 

  }

  ngOnInit(): void {
   this.getProducts();
  }
getProducts(){
  this.product.getAllProducts().subscribe(res=>{
    console.log(res);
  },err=>{
    console.log(err);

  })
}
}
