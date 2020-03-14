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
  takeUntil
} from "rxjs/operators";
import { MatDialog, MatPaginator } from "@angular/material";
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import { Subject } from "rxjs";
import { NotificationService } from "../../shared/services/notifications/notification.service";
import { TranslateService } from "@ngx-translate/core";
import { CategoriesDataSource } from './class/categories.datasource';
import { HttpCategoriesService } from './service/categories.service';
import { AddNewCategoryComponent } from './components/add-new-category/add-new-category.component';
import { CategoryItemsDataSource } from './class/category-items.datasource.';
import { AddNewCategoryItemComponent } from './components/add-new-category-item/add-new-category-item.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
import { UpdateCategoryItemComponent } from './components/update-category-item/update-category-item.component';

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: [
    "./categories.component.scss",
    "../../modules/tabel.scss"
  ]
})
export class CategoriesComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "email",
    "mobile",
    "complaint",
    "created_at",
    "Actions"
  ];
  dataSource = new CategoriesDataSource(this.httpCategoriesService);
  dataSourceCategoryItems = new CategoryItemsDataSource(this.httpCategoriesService)
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalCitiesNumber: number;
  totalAreasNumber: number;
  reset = "";
  status = "";

  selectedCategory: any;
  noClipperServices = this.dataSource
    .clipperServiceDataSubject$()
    .pipe(map(data => data.length === 0));
  @ViewChild("searchInput") search: ElementRef;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpCategoriesService: HttpCategoriesService,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new CategoriesDataSource(this.httpCategoriesService);
    this.dataSource.loadCategories$(
      0,
      this.search.nativeElement.value,
      this.status
    );
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalCitiesNumber = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }


  addNewCategory() {
    const dialogRef = this.dialogRef.open(AddNewCategoryComponent, {
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




  updateCategory(element) {
    const dialogRef = this.dialogRef.open(UpdateCategoryComponent, {
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




  deleteEvent(element) {
    this.httpCategoriesService.deleteEvent(element._id).subscribe(
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



  getActivationStatus(status) {
    this.status = status.value;
    this.loadPage(this.status);
  }
  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage(this.status))).subscribe();

    fromEvent(this.search.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage(this.status);
        })
      )
      .subscribe();


  }
  // pignate the Cities pages
  loadPage(status = "") {
    this.dataSource.loadCategories$(
      this.paginator.pageIndex,
      this.search.nativeElement.value,
      status
    );
  }

  clearSelection() {
    this.reset = null;
    this.status = "";
    this.loadPage(this.status);
  }

  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
