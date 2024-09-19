import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersService } from '../services/orders.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  subscription: any;
  cart: any = {};
  productsLength: number = 0;
  productImage: string = ''
  taxPrice: number = 100;
  couponError: string = '';

  couponForm = new FormGroup({
    name: new FormControl(null, [Validators.required])
  })

  quantityForm = new FormGroup({
    quantity: new FormControl(1, [Validators.required])
  })

  addressForm = new FormGroup({
    address: new FormControl(null, [Validators.required])
  })

  constructor(private _AuthService: AuthService, private _GlobalService: GlobalService, private _CartService: CartService,
    private _OrdersService: OrdersService, private _Router: Router) { }

  loadCart() {
    this.subscription = this._CartService.getUserCart().subscribe({
      next: (res) => {
        this.cart = res.data;
        this.productsLength = res.length;
        this._CartService.updateProductsLength(this.productsLength);
      }, error: (err) => { }
    })
  }

  removeItem(itemId: string) {
    this._CartService.removeProductFromCart(itemId).subscribe({
      next: (res) => {
        this.loadCart();
      }, error: (err) => { }
    })
  }

  updateQuantity(itemId: string, formData:FormGroup) {
    this._CartService.updateQuantity(itemId, formData.value).subscribe({
      next: (res) => {
        this.loadCart();
      }, error: (err) => { console.log(err.error.message);}
    })
  }

  addCoupon(formData: FormGroup) {
    this._CartService.applyCoupon(formData.value).subscribe({
      next: (res) => { this.loadCart() },
      error: (err) => { this.couponError = err.error.message }
    })
  }

  clearCart() {
    this._CartService.clearCart().subscribe({
      next: (res) => {
        this.productsLength = 0;
        this._CartService.updateProductsLength(this.productsLength);
        this._Router.navigate(['/home']);
      }, error: (err) => { },
    })
  }

  createOrder(formData: FormGroup) {
    this._OrdersService.createOrder(formData.value).subscribe({
      next: (res) => {
        this.productsLength = 0;
        this._CartService.updateProductsLength(this.productsLength);
        this._Router.navigate(['/myOrders']);
      }, error: (err) => { }
    })
  }

  ngOnInit(): void {
    this._AuthService.checkToken();
    this.productImage = this._GlobalService.productsImages;
    this.loadCart();
  }

  ngOnDestroy(): void { this.subscription.unsubscribe() }
}
