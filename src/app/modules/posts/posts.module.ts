import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { PostsRoutingModule } from './posts.routing';
import { PostsComponent } from './posts.component';
import {AddNewPostComponent} from "./components/add-new-admin/add-new-post.component";
// import { UpdateOrdersComponent } from './components/update-orders/update-orders.component';

@NgModule({
  imports: [CommonModule, SharedModule, PostsRoutingModule],
  declarations: [PostsComponent, AddNewPostComponent
  ],
  entryComponents:[
    AddNewPostComponent
  ]
  // entryComponents: [UpdateOrdersComponent]
})
export class PostsModule { }
