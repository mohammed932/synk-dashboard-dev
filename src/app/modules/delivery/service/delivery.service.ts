import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpDeliveryService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllDeliveries(
  ): Observable<any> {
    return this._httpClient.get(`${this.apiUrl}configurations`, {
      observe: "response"
    });
  }
  createNewDelivery(body) {
    return this._httpClient.post(`${this.apiUrl}deliveries`, body, {
      observe: "response"
    });
  }

  getSingleDelivery(deliveryId) {
    return this._httpClient.get(`${this.apiUrl}deliveries/${deliveryId}`, {
      observe: "response"
    });
  }
  updateConfigurations(body): Observable<any> {
    return this._httpClient.put(`${this.apiUrl}configurations`, body, {
      observe: "response"
    });
  }


  // updateDelivery(body) {
  //   return this._httpClient.put(`${this.apiUrl}configurations`, body, {
  //     observe: "response"
  //   });
  // }

  deleteDelivery(deliveryId) {
    return this._httpClient.delete(`${this.apiUrl}deliveries/${deliveryId}`, {
      observe: "response"
    });
  }



}
