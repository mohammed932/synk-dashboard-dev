import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { ConfigurationsRoutingModule } from './configurations.routing';
import { ConfigurationsComponent } from './configurations.component';



@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ConfigurationsRoutingModule
    ],
    declarations: [ConfigurationsComponent],
})
export class ConfigurationsModule { }
