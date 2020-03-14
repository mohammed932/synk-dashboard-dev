import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {NotificationService} from '../../../../../shared/services/notifications/notification.service';
import {HttpUsersServices} from '../../../services/httpUsersServices';
import {passBoolean} from 'protractor/built/util';
import {isBoolean} from 'util';

@Component({
  selector: 'app-update-orders',
  templateUrl: './update-orders.component.html',
  styleUrls: ['./update-orders.component.scss']
})
export class UpdateOrdersComponent implements OnInit {
  loading = false;
  isFixed = false;
  is_verified = true;

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public order: any,
    private httpOrdersService: HttpUsersServices,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService,
  ) {
  }

  ngOnInit() {

  }


  setOrderStatus(event) {
    this.is_verified = JSON.parse(event.target.value);
  }

  updateNewPromotion() {
    const data = {
      is_verified: this.is_verified
    };
    this.httpOrdersService.updateOrderStatus(data, this.order._id).subscribe(data => {
      if (data.status === 200) {
        this.notificationSerive.successNotification(`User status updated`);
        this.dialogRef.closeAll();
      }
    }, err => {
      this.notificationSerive.errorNotification(err.error.message);
    });
  }

}
