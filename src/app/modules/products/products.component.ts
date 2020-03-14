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
import { ProductsDataSource } from './class/products.datasource';
import { HttpProductsService } from './service/products.service';
import { Router } from '@angular/router';
@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: [
    "./products.component.scss",
    "../tabel.scss"
  ]
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = [
    "top_3_synkers",
    "top_3_publishers",
    "top_3_events",
  ];
  dataSource = new ProductsDataSource(this.httpProductsService);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalPromotions: number;
  reset = "";
  status = "";

  selectedCategory: any;
  noClipperServices = this.dataSource
    .clipperServiceDataSubject$()
    .pipe(map(data => data.length === 0));
  @ViewChild("searchInput") search: ElementRef;
  products: any;

  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpProductsService: HttpProductsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }
  refreshServicesData() {
    this.httpProductsService.getAllProducts().subscribe(data => {
      this.products = data.body;
      console.log(data);
    });
    this.changeDetectorRefs.detectChanges();
  }



  ngAfterViewInit() {

     }
  // pignate the Cities pages
  loadPage() {
    this.dataSource.loadProducts$(
    );
  }

  clearSelection() {
    this.reset = null;
    this.status = "";
    this.loadPage();
  }

 ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
