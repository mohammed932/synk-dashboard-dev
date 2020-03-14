import { Component, OnInit, Optional, ChangeDetectorRef, Inject, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { NotificationService } from '../../shared/services/notifications/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { map, takeUntil, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ClipperServicesDataSource } from './classes/clipperServices.data.source';
import { HttpClipperService } from './services/clipper.service';
import { Subject } from 'rxjs/internal/Subject';
import { AddClipServiceComponent } from './components/add-clipper-service/add-clipper-service.component';
import { EditClipServiceComponent } from './components/edit-clipper-service/edit-clipper-service.component';
import { fromEvent } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
@Component({
  selector: 'app-clipper-services',
  templateUrl: './clipper-services.component.html',
  styleUrls: ['./clipper-services.component.scss',
    '../../modules/tabel.scss']
})
export class ClipperServicesComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'created_at', 'updated_at', 'Images', 'Actions'];
  dataSource = new ClipperServicesDataSource(this.httpClipperService);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalCitiesNumber: number;
  totalAreasNumber: number;
  isSmallScreen: boolean;
  modalWidth: string;
  modalHeight: string;
  noClipperServices = this.dataSource.clipperServiceDataSubject$().pipe(
    map(data => data.length === 0));
  @ViewChild('searchInput') search: ElementRef;
  @ViewChild('searchServices') searchServices: ElementRef;

  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpClipperService: HttpClipperService,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.breakpointObserver
      .observe(["(max-width: 766px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isSmallScreen = true;
          this.modalWidth = '90%';
          this.modalHeight = '600px';
        } else {
          this.isSmallScreen = false;
          this.modalWidth = '600px';
          this.modalHeight = '600px';
        }
      });
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new ClipperServicesDataSource(this.httpClipperService);
    this.dataSource.loadClipperServices$(0, this.search.nativeElement.value);
    this.dataSource.mata$.pipe(
      takeUntil(this.$destroy)
    ).subscribe(totalNumber => this.totalCitiesNumber = totalNumber);
    this.changeDetectorRefs.detectChanges();
  }



  // open new city dialog to help us add new city and after closing it should refresh the list of citites

  addNewService = (): void => {
    const dialogRef = this.dialogRef.open(AddClipServiceComponent, {
      width: this.modalWidth,
      maxWidth: this.modalWidth,
      height: this.modalHeight,
      maxHeight: this.modalHeight,
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.$destroy)
    ).subscribe(() => {
      this.refreshServicesData();
    });
  }




  /* when click on tabel row get selected city data and display city areas*/

  // getSelectedCity = (city: City): void => {
  //   this.selectedCity = city;
  //   this.getAreas(this.selectedCity);
  // }


  // delete exist city from the list of cities
  deleteCity(service: any): void {
    this.httpClipperService.deleteClipperService(service._id).pipe(
      takeUntil(this.$destroy)
    ).subscribe(
      data => {
        this.notificationService.successNotification(data.body.message);
        this.refreshServicesData();
      }
    );
  }



  // edit the city and send the selected city

  editService(element) {
    const dialogRef = this.dialogRef.open(EditClipServiceComponent, {
      width: this.modalWidth,
      maxWidth: this.modalWidth,
      height: this.modalHeight,
      maxHeight: this.modalHeight,
      data: {
        data: element
      }
    });
    dialogRef.afterClosed().pipe(
      takeUntil(this.$destroy)
    ).subscribe(() => {
      this.refreshServicesData();
    });
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
    this.dataSource.loadClipperServices$(
      this.paginator.pageIndex,
      this.search.nativeElement.value
    );
  }

  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }


}
