import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClipperServicesComponent } from './clipper-services.component';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';


const routes: Routes = [
    {
        path: '',
        component: ClipperServicesComponent
    },

];

@NgModule({
    imports: [
        TranslateModule,
        LocalizeRouterModule.forChild(routes),
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class ClipperServicesRoutringModule { }
