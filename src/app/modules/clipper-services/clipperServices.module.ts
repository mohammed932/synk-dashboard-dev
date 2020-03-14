import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { ClipperServicesComponent } from './clipper-services.component';
import { EditClipServiceComponent } from './components/edit-clipper-service/edit-clipper-service.component';
import { AddClipServiceComponent } from './components/add-clipper-service/add-clipper-service.component';
import { ClipperServicesRoutringModule } from './clipperServices.routing';



@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ClipperServicesRoutringModule
    ],
    entryComponents: [AddClipServiceComponent, EditClipServiceComponent],
    declarations: [ClipperServicesComponent, AddClipServiceComponent, EditClipServiceComponent],
})
export class ClipperServicesModule { }
