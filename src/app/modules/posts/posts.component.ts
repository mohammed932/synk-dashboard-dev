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
import {MatDialog, MatPaginator} from "@angular/material";
import {fromEvent} from "rxjs/internal/observable/fromEvent";
import {Subject} from "rxjs";
import {NotificationService} from "../../shared/services/notifications/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {PostsDatasource} from './class/posts.datasource';
import {HttpPostsService} from './service/posts.service';
import {BoxAnimation} from '../../shared/animations/box-animation';
import {DeliveryDataSource} from "../delivery/class/delivery.datasource";
import {AddNewAdminComponent} from "../users/admin/components/add-new-admin/add-new-admin.component";
import {AddNewPostComponent} from "../posts/components/add-new-admin/add-new-post.component";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: [
    "../orders/orders.component.scss",
    "../tabel.scss"
  ],
  animations: [BoxAnimation]
})
export class PostsComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "desc",
    "color",
    "created_at",
    "Actions",
  ];
  dataSource = new PostsDatasource(this.httpOrdersService);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  loading = false;
  reset = "";
  status = "";
  totalEvents: number;
  filter = "";
  selectedCategory: any;
  noClipperServices = this.dataSource
    .clipperServiceDataSubject$()
    .pipe(map(data => data.length === 0));
  @ViewChild("searchInput") search: ElementRef;

  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpOrdersService: HttpPostsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.refreshServicesData();
  }

  // refreshServicesData() {
  //   this.dataSource = new OrdersDataSource(this.httpOrdersService);
  //   this.dataSource.mata$
  //     .pipe(
  //       filter(x => x !== undefined),
  //       takeUntil(this.$destroy)
  //     )
  //     .subscribe();
  //
  //   this.changeDetectorRefs.detectChanges();
  // }
  refreshServicesData() {
    this.dataSource = new PostsDatasource(this.httpOrdersService);
    this.dataSource.loadPromoCodes$(
      0,this.search.nativeElement.value,this.filter
    );
    this.dataSource.mata$
      .pipe(
        filter(x => x !== undefined),
        takeUntil(this.$destroy)
      )
      .subscribe( totalages => this.totalEvents = totalages);

    this.changeDetectorRefs.detectChanges();
  }
  deleteEvent(element) {
    this.httpOrdersService.deleteEvent(element._id).subscribe(
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


  // addNewPromotion() {
  //   const dialogRef = this.dialogRef.open(AddNewPromotionComponent, {
  //     maxWidth: "60%",
  //     width: "60%",
  //   });
  //   dialogRef
  //     .afterClosed()
  //     .pipe(takeUntil(this.$destroy))
  //     .subscribe(() => {
  //       this.refreshServicesData();
  //     });
  // }

  getActivationStatus(e) {
    this.filter = e.value;
    this.loadPage();
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
      this.filter
    );
  }

  clearSelection() {
    this.reset = null;
    this.filter = "";
    this.loadPage();
  }
  addNewPost = (): void => {
    const dialogRef = this.dialogRef.open(AddNewPostComponent, {
      maxWidth: "60%",
      width: "60%"
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshServicesData();
      });
  };

  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
