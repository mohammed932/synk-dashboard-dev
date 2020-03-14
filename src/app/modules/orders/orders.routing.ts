import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersComponent } from './orders.component';


const routes: Routes = [
    {
        path: '',
        component: OrdersComponent
    },

];

@NgModule({
    imports: [
        TranslateModule,
        LocalizeRouterModule.forChild(routes),
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class OrdersRoutingModule { }
