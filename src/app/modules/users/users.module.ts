import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../../shared/shared.module';
import {UsersRoutringModule} from './users.routing';
import {EmployeeDetailsComponent} from './employee-details/employee-details.component';
import {EmployeesComponent} from './employees/employees.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutringModule,


  ],
  declarations: [EmployeeDetailsComponent,EmployeesComponent],

})
export class UsersModule {
}
