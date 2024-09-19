import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit, OnDestroy {
  subscription: any;
  isLogin: boolean = false;
  productsLength: number = 0;
  wishlistLength: number = 0;
  cart: any = {};

  constructor(private _AuthService: AuthService, private _Router:Router, private _CartService:CartService, private _WishlistService:WishlistService){
    _AuthService.currentUser.subscribe(() => {
      if(_AuthService.currentUser.getValue() !== null){this.isLogin = true;}
      else{this.isLogin = false;}
    })
  }

  logout(){
    this._AuthService.logout();
    this._Router.navigate(['/home']);
  }

  ngOnInit(): void {
    this.subscription = this._CartService.productsLength$.subscribe(length => {
      this.productsLength = length;
    });

    this._WishlistService.wishlistLength$.subscribe(length => {
      this.wishlistLength = length;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
