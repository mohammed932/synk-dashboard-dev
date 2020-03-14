import {Component, OnInit, Optional, ChangeDetectorRef, ViewChild, OnDestroy, AfterViewInit, ElementRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {map, takeUntil, tap, debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {Subject} from 'rxjs/internal/Subject';
import {fromEvent, Subscription} from 'rxjs';
import {HttpUsersServices} from '../services/httpUsersServices';
import {MatPaginator, MatDialog} from '@angular/material';
import {CustomersDataSource} from './classes/customers.data.source';
import {NotificationService} from '../../../shared/services/notifications/notification.service';
import {OrdersDataSource} from '../../orders/class/orders.datasource';
import {UpdateOrdersComponent} from './components/update-orders/update-orders.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss', '../../../modules/tabel.scss']
})

export class CustomersComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'mobile', 'is_verified', 'Actions'];
  dataSource = new CustomersDataSource(this.httpUsersServices);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalCitiesNumber: number;
  totalUsers: number;
  role = 'customer';
  sub: Subscription;
  noClipperServices = this.dataSource.clipperServiceDataSubject$().pipe(
    map(data => data.length === 0));
  @ViewChild('searchInput') search: ElementRef;

  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpUsersServices: HttpUsersServices,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService,
  ) {
  }

  ngOnInit() {
    this.refreshServicesData();
  }
// dda
  // refreshServicesData() {
  //   this.noCities = false;
  //   this.dataSource = new CustomersDataSource(this.httpUsersServices);
  //   this.dataSource.loadUsers(0, this.search.nativeElement.value, this.role);
  //   this.dataSource.mata$.pipe(
  //     takeUntil(this.$destroy)
  //   ).subscribe();
  //   this.changeDetectorRefs.detectChanges();
  // }
  refreshServicesData() {
    this.dataSource = new CustomersDataSource(this.httpUsersServices);
    this.dataSource.loadUsers(
      0, this.search.nativeElement, this.role
    );
    this.dataSource.mata$
      .pipe(
        filter(x => x !== undefined),
        takeUntil(this.$destroy)
      )
      .subscribe(totalpages => this.totalUsers = totalpages);

    this.changeDetectorRefs.detectChanges();
  }

  deleteUser(element) {
    this.httpUsersServices.deleteUsers(element._id).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            `${data.body['message']}`
          );
          this.refreshServicesData();
        }
      },
      err => {
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }


  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();

    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage();
        })
      )
      .subscribe();
  }

  // pignate the Cities pages
  loadPage() {
    this.dataSource.loadUsers(
      this.paginator.pageIndex,
      this.search.nativeElement.value,
      this.role
    );
  }

  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
    this.changeDetectorRefs.detach();
  }

  setOrderStatusBg(status) {
    let color;
    switch (status) {
      case 'confirmed': {
        color = '#0ecb62';
        break;
      }
      case true: {
        color = '#e92929';
        break;
      }
      case false: {
        color = '#e92929';
        break;
      }
      default: {
        break;
      }
    }

    return color;
  }

  updatePromotion(element) {
    const dialogRef = this.dialogRef.open(UpdateOrdersComponent, {
      maxWidth: '60%',
      width: '60%',
      data: element
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshServicesData();
      });
  }


}
