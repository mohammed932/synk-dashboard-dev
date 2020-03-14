import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpProductsService } from '../service/products.service';

@Injectable({
  providedIn: "root"
})
export class ProductsDataSource implements DataSource<any> {
  public dataSubjectProducts = new BehaviorSubject<any[]>([]);
 
  private loadingSubject = new BehaviorSubject<boolean>(false);
 
  private metaSubjectPromotions = new BehaviorSubject<any>({});
 
  public mata$ = this.metaSubjectPromotions.asObservable();
 
  public loading$ = this.loadingSubject.asObservable();
 
  public categoriesData$ = this.dataSubjectProducts.asObservable();
 
  empty = false;

  constructor(private httpProductsService: HttpProductsService) { }

  connect(): Observable<any[]> {
    return this.dataSubjectProducts.pipe(
      tap(data => {
        this.empty = !data.length;
      })
    );
  }

  disconnect(): void {
    this.dataSubjectProducts.complete();
    this.loadingSubject.complete();
  }

  getAnalytics(){
    const analytics=    this.httpProductsService.getAllProducts().subscribe();
    return analytics
}
  loadProducts$() {
    this.loadingSubject.next(true);
    this.httpProductsService
      .getAllProducts()
      .pipe(
        first(),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        this.dataSubjectProducts.next(data.body);
      });
  }
  
  clipperServiceDataSubject$() {
    return this.dataSubjectProducts.asObservable();
  }

  isServiceEmpty$() {
    return this.dataSubjectProducts.pipe(
      filter(data => data.length < 1)
    );
  }
}
