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
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent implements OnInit {

  public pipe = new DatePipe('en-US');
  public updateCategory: FormGroup;
  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public category: any,
    private toastr: ToastrService,
    // private httpAreasService: HttpAreasService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService,
    private httpCategoryService: HttpCategoriesService
  ) { }

  ngOnInit() {
    this.updateCategory = this.fg.group({
      name: ['', Validators.required],
    });
    this.setCategoryName();
  }

  setCategoryName() {
    this.updateCategory.controls.name.setValue(this.category.name);
  }

  sendUpdatedCategory() {
    const data = {
      name: this.updateCategory.controls.name.value
    }

    this.httpCategoryService.updateCategory(data, this.category._id).subscribe(data => {
      if (data.status === 200) {
        this.notificationSerive.successNotification(`Category ${data.body['name']} created`)
        this.dialogRef.closeAll();
      }
    }, err => {
      this.notificationSerive.errorNotification(err.error.message);
    })

  }

}
