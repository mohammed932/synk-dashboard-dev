import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { HttpClipperService } from '../../services/clipper.service';
import { NotificationService } from '../../../../shared/services/notifications/notification.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-clipper-service',
  templateUrl: './add-clipper-service.component.html',
  styleUrls: [
    './add-clipper-service.component.scss',
  ]
})
export class AddClipServiceComponent implements OnInit {
  createNewClipperServiceForm: FormGroup;
  imgURL: any;
  public imagePath;
  imagePreview: any;
  private isEligibleSource = new BehaviorSubject<boolean>(false);
  isEligibleData$ = this.isEligibleSource.asObservable();
  isFormValid = false;
  isWantAnotherService = false;
  isUploadNewImage = false;
  changeTitle = false;
  loading = false;

  constructor(
    private fg: FormBuilder,
    private dialogRef: MatDialog,
    private httpClipperService: HttpClipperService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public city: any,
  ) { }

  ngOnInit() {
    this.isEligibleSource.next(false);
    this.createNewClipperServiceForm = this.fg.group({
      name: ['', Validators.required],
      name_ar: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.notificationService.errorNotification('This file is not supported, please upload image');
    }
    this.createNewClipperServiceForm.patchValue({ image: file });
    this.createNewClipperServiceForm.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    const newServiceData = {
      name: this.createNewClipperServiceForm.controls['name'].value,
      translation: {
        ar: {
          name: this.createNewClipperServiceForm.controls['name_ar'].value
        }
      },
    };

    if (this.createNewClipperServiceForm.invalid) {
      this.isEligibleSource.next(false);
      return this.notificationService.errorNotification('Please make sure that you enter correct data!');
    }
    const formData = new FormData();
    const imageValue = this.createNewClipperServiceForm.get('image').value;
    formData.append('images', imageValue, imageValue['name']);
    formData.append('data', JSON.stringify(newServiceData));

    this.httpClipperService.createNewClipperService(formData).subscribe(data => {
      this.notificationService.successNotification(`${data.body.name} created`);
      this.isEligibleSource.next(true);
      if (!this.isWantAnotherService) {
        this.dialogRef.closeAll();
      }
      this.isWantAnotherService = false;
    }, err => {
      if (err.error) {
        this.notificationService.errorNotification(err.error.message);
        this.isEligibleSource.next(false);
      }
    });
  }

  saveAndCreateAnotherOne() {
    this.isWantAnotherService = true;
    this.onSubmit();
    this.isEligibleData$.subscribe(data => {
      if (data) {
        this.imagePreview = "";
        this.createNewClipperServiceForm.reset();
        this.changeTitle = true;
      }
    });
  }

}
