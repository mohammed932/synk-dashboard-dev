import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpOrdersService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllOrders(
    page = 0,
    $search = "",
    $code = "",
    $filter = "",
    limit = 10,


  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("title", $search);
    params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}events`, {
      params: params,
      observe: "response"
    });
  }





  updateOrderStatus(status, orderId) {
    return this._httpClient.put(`${this.apiUrl}orders/${orderId}`, status, {
      observe: "response"
    })
  }
  deleteEvent(eventId) {
    return this._httpClient.delete(`${this.apiUrl}events/${eventId}`, {
      observe: "response"
    });
  }




}
