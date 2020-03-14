import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable, BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpProductsService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }
  public selectedProductSubject = new BehaviorSubject<any>([]);

  getAllProducts(
  ): Observable<any> {
    return this._httpClient.get(`${this.apiUrl}analytics`, {
      observe: "response"
    });
  }

  setSelectedProducts(products: any[]) {
    return this.selectedProductSubject.next(products);
  }


  getSelectedProducts() {
    return this.selectedProductSubject.asObservable();
  }

  createOffer(body) {
    return this._httpClient.post(`${this.apiUrl}offers`, body, {
      observe: "response"
    });
  }

  getCategoryItems(categoryId): Observable<any> {
    return this._httpClient.get(`${this.apiUrl}categories/${categoryId}/items`, {
      observe: "response"
    });
  }

  deleteProduct(productId) {
    return this._httpClient.delete(`${this.apiUrl}products/${productId}`, {
      observe: "response"
    });
  }

  createPost(body) {
    return this._httpClient.post(`${this.apiUrl}events`, body, {
      observe: "response"
    });
  }



}
