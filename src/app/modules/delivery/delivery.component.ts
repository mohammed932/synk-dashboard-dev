/////////////////////////////

import {Component, OnDestroy, OnInit, Optional} from "@angular/core";
import {MatDialog} from "@angular/material";
import {NotificationService} from "../../shared/services/notifications/notification.service";
import {HttpDeliveryService} from "../delivery/service/delivery.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "app-delivery",
  templateUrl: "./delivery.component.html",
  styleUrls: [
    "./delivery.component.scss",
    "../tabel.scss"
  ]
})
export class DeliveryComponent implements OnInit, OnDestroy {
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
    private httpConfigurationsServices: HttpDeliveryService,
    private fg: FormBuilder
  ) {}

  ngOnInit() {
    this.configurationsForm = this.fg.group({
      account_number: ["", Validators.required],
      bank_name: ["", Validators.required],
      maximum_wallet: ["", Validators.required],
      synk_percentage: ["", Validators.required],
      support_number: ["", Validators.required],
    });

    this.configurationsForm.disable();
    this.getConfigurationsData();
  }

  editConfigurationsData() {
    this.configurationsForm.enable();
    this.isEdit = true;
  }


  getConfigurationsData() {
    this.httpConfigurationsServices
      .getAllDeliveries()
      .pipe(
        map(res => res.body),
        map(officeData => {
          return {
            bank: officeData.bank,
            synk_percentage: officeData.synk_percentage,
            support_number: officeData.support_number,
            updated_at: officeData.updated_at,
            created_at: officeData.created_at,
            _id: officeData._id
          };
        }),
        tap(data => {
          this.configurationsForm.controls.account_number.setValue(
            data.bank.account_number
          );
          this.configurationsForm.controls.bank_name.setValue(
            data.bank.bank_name
          );
          this.configurationsForm.controls.synk_percentage.setValue(data.synk_percentage);
          this.configurationsForm.controls.support_number.setValue(
            data.support_number
          );
        })
      )
          .subscribe(data => {
            this.officeData = data;
          })
  }

  onSubmit() {
    const updateServiceWithoutNewImage = {
      bank: {
        account_number: parseInt(
          this.configurationsForm.controls.account_number.value
        ),
        bank_name: this.configurationsForm.controls.bank_name.value,
        logo: this.officeData.bank.logo
      },
      synk_percentage: parseInt(this.configurationsForm.controls.synk_percentage.value),
      support_number: this.configurationsForm.controls.support_number.value
    };

    this.sendUpdatedConfigurations(updateServiceWithoutNewImage);
  }

  private sendUpdatedConfigurations(data) {
    this.httpConfigurationsServices.updateConfigurations(data).subscribe(
      data => {
        this.notificationService.successNotification(`Configurations updated`);
        this.isEdit = false;
        this.configurationsForm.disable();
      },
      err => {
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
/////////////////////////////////////////////////////
}
