import {
  Component,
  OnInit,
  Optional,
  ElementRef,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import {
  map,
  distinctUntilChanged,
  debounceTime,
  tap,
  takeUntil,
  filter
} from "rxjs/operators";
import { MatDialog, MatPaginator } from "@angular/material";
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import { Subject } from "rxjs";
import { NotificationService } from "../../shared/services/notifications/notification.service";
import { TranslateService } from "@ngx-translate/core";
import { PromotionsDataSource } from './class/promotions.datasource';
import { HttpPromotionsService } from './service/promotions.service';
import { AddNewPromotionComponent } from './components/add-new-promotion/add-new-promotion.component';
import { UpdateCategoryComponent } from '../categories/components/update-category/update-category.component';
import { UpdatePromotionComponent } from './components/update-promotion/update-promotion.component';
@Component({
  selector: "app-promotions",
  templateUrl: "./promotions.component.html",
  styleUrls: [
    "./promotions.component.scss",
    "../tabel.scss"
  ]
})
export class PromotionsComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "mobile",
    "email",
    "wallet",
    "Actions",
  ];
  dataSource = new PromotionsDataSource(this.httpPromotionsService);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  loading = false;
  noCities = false;
  totalPromotions: number;
  reset = "";
  status = "";
  totalWallets:number;
  selectedCategory: any;
  noClipperServices = this.dataSource
    .clipperServiceDataSubject$()
    .pipe(map(data => data.length === 0));
  @ViewChild("searchInput") search: ElementRef;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpPromotionsService: HttpPromotionsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new PromotionsDataSource(this.httpPromotionsService);
    this.dataSource.loadPromoWallets$(
      0,
      this.search.nativeElement.value,
    );
    this.dataSource.mata$
      .pipe(
        filter(x => x !== undefined),
        takeUntil(this.$destroy)
      )
      .subscribe(totalNumber => this.totalWallets = totalNumber);

    this.changeDetectorRefs.detectChanges();
  }



  addNewPromotion() {
    const dialogRef = this.dialogRef.open(AddNewPromotionComponent, {
      maxWidth: "60%",
      width: "60%",
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshServicesData();
      });
  }


  updatePromotion(element) {
    const dialogRef = this.dialogRef.open(UpdatePromotionComponent, {
      maxWidth: "60%",
      width: "60%",
      data: element
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshServicesData();
      });
  }


  resetWallet(element) {
    this.httpPromotionsService.resetWallet(element._id).subscribe(
      data => {
          this.notificationService.successNotification(
            `wallet reset successfully`);
          this.refreshServicesData();
      },
      err => {
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }

  getSelectedCategory(element) {
    this.selectedCategory = element;
  }


  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();

    fromEvent(this.search.nativeElement, "keyup")
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
    this.dataSource.loadPromoCodes$(
      this.paginator.pageIndex,
      this.search.nativeElement.value,
    );
  }

  clearSelection() {
    this.reset = null;
    this.status = "";
    this.loadPage();
  }

  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
