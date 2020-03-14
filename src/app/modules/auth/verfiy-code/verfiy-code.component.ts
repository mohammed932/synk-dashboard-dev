import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpResponse } from '@angular/common/http';
import { NotificationService } from '../../../shared/services/notifications/notification.service';

@Component({
  selector: 'app-verfiy-code',
  templateUrl: './verfiy-code.component.html',
  styleUrls: ['./verfiy-code.component.scss', '../login/login.component.scss']
})
export class VerfiyCodeComponent implements OnInit {

  counter = 30;
  interval = 1000;
  loading: boolean = false;
  loadingResend: boolean = false;
  userData = {};
  value;
  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifcationService: NotificationService
  ) { }

  public verifyCodeForm = this.fg.group({
    mobile: ["", Validators.required],
  });

  ngOnInit() {
    this.verifyCodeForm.controls.mobile.setValue(localStorage.getItem('mobile_token'));
  }



  requiredErrorMessage($feild) {
    return this.verifyCodeForm.controls[$feild].hasError("required")
      ? "You must enter a value"
      : "";
  }

  resendCode() {
    const userMobileNumber = this.authService.getUserPhoneNumber();
    let userCredentials = {
      mobile: userMobileNumber,
      type: "admin"
    };

    if (!this.loadingResend) {
      this.loadingResend = true;
      this.authService.login(userCredentials).subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.verifyCodeForm.controls.mobile.setValue(resp.body.mobile_token);
            this.authService.saveUserId(resp.body.id);
            localStorage.setItem('mobile_token', resp.body.mobile_token);
            this.loadingResend = false;
          }
        },
        err => {
          this.loadingResend = false;
          this.notifcationService.errorNotification(err.error.message);
        }
      );
    }
  }

  verifyCode() {
    const data = {
      mobile_token: localStorage.getItem('mobile_token'),
      userId: localStorage.getItem('userId')
    }
    this.isValidCode(data);
  }

  isValidCode(data) {
    const userData = {
      user: data.userId,
      mobile_token: parseInt(data.mobile_token)
    }
    this.authService.varifyCode(userData).subscribe(resp => {
      if (resp.status === 200) {
        this.counter = 30;
        let userType = resp.body.roles[0];
        if (userType === 'admin' || userType === 'operation') {
          userType === 'operation' ? this.authService.isUserOperationSource.next(false) : this.authService.isUserOperationSource.next(true);
          this.authService.saveToken(resp.body.token);
          this.authService.saveUserData(resp.body);
          this.router.navigate(['']);
        } else {
          // Todo إلى اشعاراً اخر 
          this.notifcationService.errorNotification('You have no access');
        }

      }
    }, err => {
        this.notifcationService.errorNotification(err.error.message);
    })
  }


}
