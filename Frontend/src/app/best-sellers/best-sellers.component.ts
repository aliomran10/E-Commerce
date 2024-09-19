import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { CommonModule } from '@angular/common';
import { DescriptionPipe } from '../pipes/description.pipe';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  imports: [CommonModule, DescriptionPipe, RouterLink],
  templateUrl: './best-sellers.component.html',
  styleUrl: './best-sellers.component.scss'
})
export class BestSellersComponent implements OnInit, OnDestroy {
  subscription: any;
  imgDomain: string = '';
  search: string = '';
  products: any[] = [];
  productsLength: number = 0;

  constructor(private _ProductsService: ProductsService, private _CartService: CartService) { }


  addToCart(productId: string) {
    this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this.productsLength = res.length
        this._CartService.updateProductsLength(this.productsLength)
      }, error: (err) => { }
    })
  }

  searchProduct(product:string){
    this.search = product;
    this.subscription = this._ProductsService.getProducts(4, 1, '-sold', this.search).subscribe((res) => {
      this.products = res.data;
    })
  }

  ngOnInit(): void {
    this.imgDomain = this._ProductsService.productImages;
    this.subscription = this._ProductsService.getProducts(4, 1, '-sold', this.search).subscribe((res) => {
      this.products = res.data;
    })
  }

  ngOnDestroy(): void { this.subscription.unsubscribe() }
}
