import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { OrdersRoutingModule } from './orders.routing';
import { OrdersComponent } from './orders.component';
import { UpdateOrdersComponent } from './components/update-orders/update-orders.component';
@NgModule({
  imports: [CommonModule, SharedModule, OrdersRoutingModule],
  declarations: [OrdersComponent, UpdateOrdersComponent
  ],
  entryComponents: [UpdateOrdersComponent]
})
export class OrdersModule { }
