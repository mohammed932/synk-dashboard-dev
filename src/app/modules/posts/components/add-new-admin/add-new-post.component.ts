import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { AuthService } from "../../../auth/services/auth.service";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
// import { HttpUsersServices } from "../../services/httpUsersServices";
import {HttpPostsService} from "../../service/posts.service";

@Component({
  selector: "app-add-new-admin",
  templateUrl: "./add-new-post.component.html",
  styleUrls: ["./add-new-admin.component.scss"]
})
export class AddNewPostComponent implements OnInit {
  createNewUser: FormGroup;
  isFormValid = false;
  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  locationValues = [];

  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private httpPostsService: HttpPostsService,
    @Inject(MAT_DIALOG_DATA) public city: any,
    private mdRef: MatDialog
  ) {}

  ngOnInit() {
    this.createNewUser = this.fg.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      color: ["", Validators.required],
    });
  }

  onSubmit() {
    this.loading = true;
    const adminData = {
      title: this.createNewUser.controls.title.value,
      description: this.createNewUser.controls.description.value,
      is_public: true,
      type: "post"
    };
    if (this.createNewUser.invalid) {
      this.loading = false;
      return this.notificationService.errorNotification(
        "Please enter correct data!"
      );
    }

    this.httpPostsService.createPost(adminData).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            "Admin has been Created"
          );
          this.mdRef.closeAll();
        }
      },
      err => {
        this.loading = false;
        console.log(err);
        this.notificationService.errorNotification(err.message);
      }
    );
  }
}
