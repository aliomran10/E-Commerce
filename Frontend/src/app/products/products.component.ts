import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { DescriptionPipe } from '../pipes/description.pipe';
import { CommonModule } from '@angular/common';
import { Pagination } from '../interfaces/pagination';
import { CartService } from '../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, DescriptionPipe, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  subscription: any;
  products: any[] = [];
  pagination: Pagination = {};
  imgDomain: string = '';
  search: string = '';
  page: number = 1;
  productsLength: number = 0;
  
  constructor(private _ProductsService: ProductsService, private _CartService: CartService) { }

  loadProducts() {
    this.subscription = this._ProductsService.getProducts(4, this.page, undefined, this.search).subscribe((res) => {
      this.products = res.data;
      this.pagination = res.pagination;
    })
  }

  addToCart(productId: string) {
    this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this.productsLength = res.length
        this._CartService.updateProductsLength(this.productsLength)
      }, error: (err) => { }
    })
  }

  changePage(page: number) {
    this.page = page;
    this.loadProducts()
  }

  searchProduct(product:string){
    this.search = product;
    this.loadProducts();
  }

  ngOnInit(): void {
    this.imgDomain = this._ProductsService.productImages;
    this.loadProducts();
  }

  ngOnDestroy(): void { this.subscription.unsubscribe() }
}