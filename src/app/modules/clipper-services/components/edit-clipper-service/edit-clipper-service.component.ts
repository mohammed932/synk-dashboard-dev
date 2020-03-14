import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { HttpClipperService } from '../../services/clipper.service';
import { NotificationService } from '../../../../shared/services/notifications/notification.service';

@Component({
  selector: 'app-edit-clipper-service',
  templateUrl: './edit-clipper-service.component.html',
  styleUrls: ['./edit-clipper-service.component.scss']
})
export class EditClipServiceComponent implements OnInit {

  createNewClipperServiceForm: FormGroup;
  imgURL: any;
  public imagePath;
  imagePreview: any;
  isUploadNewImage = false;
  loading = false;
  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public serviceData: any,
    private httpClipperService: HttpClipperService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.createNewClipperServiceForm = this.fg.group({
      name: ['', Validators.required],
      name_ar: [''],
      image: ['']
    });

    this.setCurrentServicesData();
  }

  setCurrentServicesData() {
    this.createNewClipperServiceForm.controls['name'].setValue(this.serviceData.data.name);
    this.createNewClipperServiceForm.controls['name_ar'].setValue(this.serviceData.data.translation.ar.name);
    this.imagePreview = this.serviceData.data.images[0];
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.createNewClipperServiceForm.patchValue({ image: file });
    this.createNewClipperServiceForm.get("image").updateValueAndValidity();
    const reader = new FileReader();
    this.isUploadNewImage = true;
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    const updateServiceWithNewImage = {
      name: this.createNewClipperServiceForm.controls['name'].value,
      translation: {
        ar: {
          name: this.createNewClipperServiceForm.controls['name_ar'].value
        }
      },
    };

    if (this.createNewClipperServiceForm.invalid) {
      return this.notificationService.errorNotification('Please make sure that you enter correct data!');
    }
    const compareImagesSrc = this.imagePreview.localeCompare(this.serviceData.data.images[0]);
    if (compareImagesSrc < 0) {
      const formData = new FormData();
      const imageValue = this.createNewClipperServiceForm.get('image').value;
      formData.append('images', imageValue, imageValue['name']);
      formData.append('data', JSON.stringify(updateServiceWithNewImage));
      return this.sendUpdatedService(this.serviceData.data._id, formData);

    }
    const updateServiceWithoutNewImage = {
      data: {
        name: this.createNewClipperServiceForm.controls['name'].value,
        translation: {
          ar: {
            name: this.createNewClipperServiceForm.controls['name_ar'].value
          }
        },
      },
      images: [this.serviceData.data.images[0]]
    };
    this.sendUpdatedService(this.serviceData.data._id, updateServiceWithoutNewImage);
  }

  private sendUpdatedService(serviceId, formData) {
    this.httpClipperService.updateClipperService(serviceId, formData).subscribe(data => {
      this.notificationService.successNotification(`${data.body.name} updated`);
      this.isUploadNewImage = false;
    }, err => {
      if (err.error) {
        this.notificationService.errorNotification(err.error.message);
      }
    });
  }

}
