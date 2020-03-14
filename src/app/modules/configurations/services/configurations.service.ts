import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class HttpConfigurationsService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) {}

  getConfigurationsFromApi(): Observable<any> {
    return this._httpClient.get(`${this.apiUrl}configurations`, {
      observe: "response"
    });
  }

  updateConfigurations(body): Observable<any> {
    const headers = new HttpHeaders();
    if (body.hasOwnProperty("images")) {
      headers.append("Content-Type", "multipart/form-data");
      return this._httpClient.put(`${this.apiUrl}configurations`, body, {
        headers: headers,
        observe: "response"
      });
    }
    return this._httpClient.put(`${this.apiUrl}configurations`, body, {
      observe: "response"
    });
  }
}
