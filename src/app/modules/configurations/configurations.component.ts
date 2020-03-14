import { Component, OnInit, Optional, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { NotificationService } from "../../shared/services/notifications/notification.service";
import { MatDialog } from "@angular/material";
import { HttpConfigurationsService } from "./services/configurations.service";
import { map, tap } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-configurations",
  templateUrl: "./configurations.component.html",
  styleUrls: [
    "./configurations.component.scss",
  ]
})
export class ConfigurationsComponent implements OnInit, OnDestroy {
  officeData: any;
  imgURL: any;
  public imagePath;
  imagePreview: any;
  configurationsForm: FormGroup;
  needToUpdate: boolean = true;
  isUploadNewImage = false;
  isEdit = false;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private notificationService: NotificationService,
    private httpConfigurationsServices: HttpConfigurationsService,
    private fg: FormBuilder
  ) {}

  ngOnInit() {
    this.configurationsForm = this.fg.group({
      account_name: ["", Validators.required],
      account_number: ["", Validators.required],
      logo: ["", Validators.required],
      bank_name: ["", Validators.required],
      maximum_wallet: ["", Validators.required],
      percentage: ["", Validators.required],
      support_number: ["", Validators.required],
      fine_cost: ["", Validators.required]
    });

    this.configurationsForm.disable();
    this.getConfigurationsData();
  }

  editConfigurationsData() {
    this.configurationsForm.enable();
    this.isEdit = true;
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.notificationService.errorNotification(
        "This file is not supported, please upload image"
      );
    }
    this.configurationsForm.patchValue({ logo: file });
    this.configurationsForm.get("logo").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  getConfigurationsData() {
    this.httpConfigurationsServices
      .getConfigurationsFromApi()
      .pipe(
        map(res => res.body),
        map(officeData => {
          return {
            bank: officeData.bank,
            maximum_wallet: officeData.maximum_wallet,
            percentage: officeData.percentage,
            fine_cost: officeData.fine_cost,
            support_number: officeData.support_number,
            logo: officeData.bank.logo,
            updated_at: officeData.updated_at,
            created_at: officeData.created_at,
            _id: officeData._id
          };
        }),
        tap(data => {
          this.configurationsForm.controls.account_name.setValue(
            data.bank.account_name
          );
          this.configurationsForm.controls.account_number.setValue(
            data.bank.account_number
          );
          this.configurationsForm.controls.bank_name.setValue(
            data.bank.bank_name
          );
          this.configurationsForm.controls.maximum_wallet.setValue(
            data.maximum_wallet
          );
          this.configurationsForm.controls.percentage.setValue(data.percentage);
          this.configurationsForm.controls.support_number.setValue(
            data.support_number
          );
          this.configurationsForm.controls.fine_cost.setValue(data.fine_cost);
          this.configurationsForm.controls.logo.setValue(data.bank.logo);

          this.imagePreview = data.bank.logo;
        })
      )
      .subscribe(data => {
        this.officeData = data;
      });
  }

  onSubmit() {
    const updateServiceWithNewImage = {
      bank: {
        account_name: this.configurationsForm.controls.account_name.value,
        account_number: parseInt(
          this.configurationsForm.controls.account_number.value
        ),
        bank_name: this.configurationsForm.controls.bank_name.value,
        logo: this.officeData.bank.logo
      },
      maximum_wallet: parseInt(
        this.configurationsForm.controls.maximum_wallet.value
      ),
      percentage: parseInt(this.configurationsForm.controls.percentage.value),
      fine_cost: parseInt(this.configurationsForm.controls.fine_cost.value),
      support_number: this.configurationsForm.controls.support_number.value
    };

    const compareImagesSrc = this.imagePreview.localeCompare(
      this.officeData.bank.logo
    );
    if (compareImagesSrc < 0) {
      const formData = new FormData();
      const imageValue = this.configurationsForm.get("logo").value;
      formData.append("logo", imageValue);
      formData.append("data", JSON.stringify(updateServiceWithNewImage));
      return this.sendUpdatedConfigurations(formData);
    }
    const updateServiceWithoutNewImage = {
      bank: {
        account_name: this.configurationsForm.controls.account_name.value,
        account_number: this.configurationsForm.controls.account_number.value,
        bank_name: this.configurationsForm.controls.bank_name.value,
        logo: this.officeData.bank.logo
      },
      maximum_wallet: parseInt(
        this.configurationsForm.controls.maximum_wallet.value
      ),
      percentage: parseInt(this.configurationsForm.controls.percentage.value),
      fine_cost: parseInt(this.configurationsForm.controls.fine_cost.value),
      support_number: this.configurationsForm.controls.support_number.value
    };
    this.sendUpdatedConfigurations(updateServiceWithoutNewImage);
  }

  private sendUpdatedConfigurations(data) {
    this.httpConfigurationsServices.updateConfigurations(data).subscribe(
      data => {
        this.notificationService.successNotification(`Configurations updated`);
        this.isUploadNewImage = false;
        this.isEdit = false;
        this.configurationsForm.disable();
      },
      err => {
        // @Todo Validation Error حين اشعاراُ آخر
        if (err.error) {
          this.notificationService.errorNotification(err.error.message);
        }
      }
    );
  }

  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    // this.$destroy.next();
    // this.$destroy.complete();
  }
}
