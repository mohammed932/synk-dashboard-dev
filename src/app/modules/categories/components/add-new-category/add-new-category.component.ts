import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../../../shared/services/notifications/notification.service';
import {
  HttpCategoriesService
} from '../../service/categories.service';
@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.scss']
})
export class AddNewCategoryComponent implements OnInit {

  public pipe = new DatePipe('en-US');
  public createNewCategory: FormGroup;
  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public city: any,
    private toastr: ToastrService,
    // private httpAreasService: HttpAreasService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService,
    private httpCategoryService: HttpCategoriesService
  ) { }

  ngOnInit() {
    this.createNewCategory = this.fg.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  saveNewCategory() {
    const data = {
      title: this.createNewCategory.controls.title.value,
      description: this.createNewCategory.controls.description.value,
      is_public: true,
      type:'post'
    };

    this.httpCategoryService.sendNewCategory(data).subscribe(data => {
      if (data.status === 200) {
        this.notificationSerive.successNotification(`Post ${data.body['title']} created`);
        this.dialogRef.closeAll();
      }
    }, err => {
      this.notificationSerive.errorNotification(err.error.message);
    })

  }

}
