import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpPromotionsService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getUsersWallets(
    page = 0,
    $search = "",
    $code = "",
    limit = 10,
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("user", $search);
    params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}wallets`, {
      params: params,
      observe: "response"
    });
  }

  resetWallet(userId) {
    return this._httpClient.put(`${this.apiUrl}wallets/${userId}`, {
      observe: "response"
    });
  }


  createNewPromoCode(body) {
    return this._httpClient.post(`${this.apiUrl}promocodes`, body, {
      observe: "response"
    });
  }





}
