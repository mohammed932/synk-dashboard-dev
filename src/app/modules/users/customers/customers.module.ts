import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers.routing';
import { CustomersComponent } from './customers.component';
import { UpdateOrdersComponent } from './components/update-orders/update-orders.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CustomersRoutingModule
    ],
    declarations: [CustomersComponent,UpdateOrdersComponent],
  entryComponents: [UpdateOrdersComponent]

})
export class CustomersModule { }
