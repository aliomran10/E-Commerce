import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private hostName: string = '';
  private routeName: string = '';
  private wishlistLengthSource = new BehaviorSubject<number>(0);
  wishlistLength$ = this.wishlistLengthSource.asObservable();
  
  constructor(private _HttpClient: HttpClient, private _GlobalService: GlobalService) {
    this.hostName = this._GlobalService.hostName;
    this.routeName = this._GlobalService.wishlistRoute;
  }

  updateWishlistLength(length: number) {
    this.wishlistLengthSource.next(length);
  }

  addToWishlist(product: string): Observable<any> {
    return this._HttpClient.post(`${this.hostName}${this.routeName}`, { product }, { headers: { authorization: `Bearer ${localStorage.getItem('user')}` } })
  }

  getUserWishlist(): Observable<any> {
    return this._HttpClient.get(`${this.hostName}${this.routeName}`, { headers: { authorization: `Bearer ${localStorage.getItem('user')}` } })
  }

  removeFromWishlist(itemId: string): Observable<any> {
    return this._HttpClient.delete(`${this.hostName}${this.routeName}/${itemId}`, { headers: { authorization: `Bearer ${localStorage.getItem('user')}` } })
  };
}
