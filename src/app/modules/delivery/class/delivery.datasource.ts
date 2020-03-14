import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpDeliveryService } from '../service/delivery.service';

@Injectable({
  providedIn: "root"
})
export class DeliveryDataSource implements DataSource<any> {
  public dataSubjectDeliveries = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private metaSubjectPromotions = new BehaviorSubject<any>({});
  public mata$ = this.metaSubjectPromotions.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public categoriesData$ = this.dataSubjectDeliveries.asObservable();
  empty = false;

  constructor(private httpDeliveryService: HttpDeliveryService) { }

  connect(): Observable<any[]> {
    return this.dataSubjectDeliveries.pipe(
      tap(data => {
        this.empty = !data.length;
      })
    );
  }

  disconnect(): void {
    this.dataSubjectDeliveries.complete();
    this.loadingSubject.complete();
  }
// .pipe(
//     map(res => res.body),
//   map(officeData => {
//   return {
//   bank: officeData.bank,
//   maximum_wallet: officeData.maximum_wallet,
//   percentage: officeData.percentage,
//   fine_cost: officeData.fine_cost,
//   support_number: officeData.support_number,
//   logo: officeData.bank.logo,
//   updated_at: officeData.updated_at,
//   created_at: officeData.created_at,
//   _id: officeData._id
// };
// }),
// tap(data => {
//   this.configurationsForm.controls.account_name.setValue(
//     data.bank.account_name
//   );
//   this.configurationsForm.controls.account_number.setValue(
//     data.bank.account_number
//   );
//   this.configurationsForm.controls.bank_name.setValue(
//     data.bank.bank_name
//   );
//   this.configurationsForm.controls.maximum_wallet.setValue(
//     data.maximum_wallet
//   );
//   this.configurationsForm.controls.percentage.setValue(data.percentage);
//   this.configurationsForm.controls.support_number.setValue(
//     data.support_number
//   );
//   this.configurationsForm.controls.fine_cost.setValue(data.fine_cost);
//   this.configurationsForm.controls.logo.setValue(data.bank.logo);
//
//   this.imagePreview = data.bank.logo;
// })
// )
// .subscribe(data => {
//   this.officeData = data;
// });


loadDeliveries$() {
    this.loadingSubject.next(true);
    this.httpDeliveryService
      .getAllDeliveries()
      .pipe(
        first(),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        console.log('testttttt :',data.body);
        this.dataSubjectDeliveries.next(data.body);
      });
  }
  clipperServiceDataSubject$() {
    return this.dataSubjectDeliveries.asObservable();
  }

  isServiceEmpty$() {
    return this.dataSubjectDeliveries.pipe(
      filter(data => data.length < 1)
    );
  }
}
