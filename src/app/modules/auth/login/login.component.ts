import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpResponse } from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { LanguageService } from "../../../shared/services/language/language.service";
import { NotificationService } from "../../../shared/services/notifications/notification.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  userData = {};

  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    private notifcationService: NotificationService
  ) { }

  public loginForm = this.fg.group({
    email: ["", Validators.required],
    password: ["", Validators.required]
  });

  ngOnInit() { }

  requiredErrorMessage($feild) {
    return this.loginForm.controls[$feild].hasError("required")
      ? "You must enter a value"
      : "";
  }

  login() {
    const email = this.loginForm.controls.email.value.toString();
    const password = this.loginForm.controls.password.value.toString();
    let userCredentials = {
      email: email,
      password: password,
      type: "admin"
    };
    if (this.loginForm.invalid) {
      this.notifcationService.errorNotification(
        "Please Enter Valid Email"
      );
      return;
  }

    if (this.loginForm.valid && !this.loading) {
      this.loading = true;

      this.authService.login(userCredentials).subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.authService.saveUserPhoneNumber(email);
            //save user id
            this.authService.saveUserId(resp.body._id);
            this.authService.saveToken(resp.body.token);
            //just for development
            // localStorage.setItem("mobile_token", resp.body.mobile_token);
            // this.authService.isLoggedIn();
            this.router.navigateByUrl(`${localStorage.getItem("LOCALIZE_DEFAULT_LANGUAGE")}/events`);
          }
        },
        err => {
          this.loading = false;
          this.notifcationService.errorNotification(err.error.message);
        }
      );
    }
  }

  setUserDataToLocalStorage(userData) {
    localStorage.setItem("user", JSON.stringify(userData["id"]));
  }
}
