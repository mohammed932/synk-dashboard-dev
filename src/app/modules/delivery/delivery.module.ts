import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { DeliveryComponent } from './delivery.component';
import { DeliveryRoutingModule } from './delivery.routing';

@NgModule({
  imports: [CommonModule, SharedModule, DeliveryRoutingModule],
  declarations: [ DeliveryComponent, ],
  entryComponents: []
})
export class DeliveryModule {
}
