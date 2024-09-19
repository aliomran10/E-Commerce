import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  hostName: string = '';
  routeName: string = '';
  
  constructor(private _HttpClient: HttpClient, private _GlobalService: GlobalService) {
    this.hostName = this._GlobalService.hostName;
    this.routeName = this._GlobalService.orderRoute;
  }

  getUserOrders(limit: number = 3, page: number = 1, sort: '-createdAt', search: string): Observable<any> {
    return this._HttpClient.get(`${this.hostName}${this.routeName}?limit=${limit}&page=${page}&sort=${sort}&search=${search}`,
      { headers: { authorization: `Bearer ${localStorage.getItem('user')}` } })
  }

  createOrder(formData: any): Observable<any> {
    return this._HttpClient.post(`${this.hostName}${this.routeName}`, {formData}, { headers: { authorization: `Bearer ${localStorage.getItem('user')}` } })
  }
}
