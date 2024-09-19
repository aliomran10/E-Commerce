import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';
import { GlobalService } from '../services/global.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit, OnDestroy {
  subscription:any;
  wishlist:any[] = [];
  wishlistLength:number = 0;
  productImage:string = '';
  productsLength: number = 0;
  

  constructor(private _AuthService:AuthService, private _WishlistService:WishlistService, private _CartService:CartService, private _GlobalService:GlobalService){}

  loadWishlist(){
    this.subscription = this._WishlistService.getUserWishlist().subscribe({
      next: (res) => {
        this.wishlist = res.data;
        this.wishlistLength = res.length;
        this._WishlistService.updateWishlistLength(this.wishlistLength);
      },
      error: (err) => {}
    })
  }

  removeFromWishlist(itemId:string){
    this._WishlistService.removeFromWishlist(itemId).subscribe({
      next: (res) => {
        this.loadWishlist();
      },
      error: (err) => {}
    })
  }

  addToCart(product:string){
    this._CartService.addProductToCart(product).subscribe({
      next: (res) => {
        this.productsLength = res.length
        this._CartService.updateProductsLength(this.productsLength)
      }, error: (err) => { }
    })
  }

  ngOnInit(): void {
    this._AuthService.checkToken();
    this.productImage = this._GlobalService.productsImages;
    this.loadWishlist();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
