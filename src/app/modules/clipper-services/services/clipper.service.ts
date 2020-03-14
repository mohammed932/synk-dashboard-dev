import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClipperService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllClipperServicesFromApi(page = 0, $search = '', limit = 10): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());
    params = params.append('name', $search);
    params = params.append('pagination', 'true');
    return this._httpClient.get(`${this.apiUrl}categories`,
      {
        params: params,
        observe: 'response'
      });
  }

  createNewClipperService(body): Observable<any> {
    const headers = new HttpHeaders();
    /** No need to include Content-Type in Angular 4 */
    headers.append('Content-Type', 'multipart/form-data');
    return this._httpClient.post(`${this.apiUrl}categories`, body, { headers: headers, observe: 'response' });
  }

  deleteClipperService(serviceId): Observable<any> {
    return this._httpClient.delete(`${this.apiUrl}categories/${serviceId}`, {
      observe: 'response'
    });
  }

  updateClipperService(serviceId, body): Observable<any> {
    const headers = new HttpHeaders();
    if (body.hasOwnProperty('images')) {
      headers.append('Content-Type', 'multipart/form-data');
      return this._httpClient.put(`${this.apiUrl}categories/${serviceId}`, body, {
        headers: headers,
        observe: 'response'
      });
    }
    return this._httpClient.put(`${this.apiUrl}categories/${serviceId}`, body, {
      observe: 'response'
    });
  }

  getSingleService(serviceId, coordinates): Observable<any> {
    return this._httpClient.get(`${this.apiUrl}categories${serviceId}/${coordinates}`, {
      observe: 'response'
    });
  }
}
