import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserlayoutComponent } from "./core/userlayout/userlayout.component";
import { CanActivateViaAuthGuard } from "./modules/auth/auth-guard/auth.guard";
import { CanActivateLoginGuard } from "./modules/auth/auth-guard/login-guard";
import { CanActivateAdminGuard } from "./modules/auth/auth-guard/adminAuth.guard";

export const routes: Routes = [
  {
    path: "",
    component: UserlayoutComponent,
    children: [
      {
        path: "",
        loadChildren: "./modules/dashboard/dashboard.module#DashBoardModule",
        pathMatch: "full"
      },
      {
        path: "wallets",
        loadChildren:
          "./modules/promotions/promotions.module#PromotionsModule",
      }, {
        path: "analytics",
        loadChildren:
          "./modules/products/products.module#ProductsModule",
      },
      {
        path: "configurations",
        loadChildren:
          "./modules/delivery/delivery.module#DeliveryModule",
      },
      {
        path: "posts",
        loadChildren:
          "./modules/posts/posts.module#PostsModule",
      },

      {
        path: "admins",
        loadChildren:
          "./modules/users/admin/admin.module#AdminModule",
      }, {
        path: "events",
        loadChildren:
          "./modules/orders/orders.module#OrdersModule"
      },
      {
        path: "offers",
        loadChildren:
          "./modules/offers/offers.module#OffersModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "create-product",
        loadChildren:
          "./modules/create-product/create-product.module#CreateProductModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "users",
        loadChildren: "./modules/users/customers/customers.module#CustomersModule",
      },
      {
        path: "complaints",
        loadChildren: "./modules/categories/categories.module#CategoriesModule"
      }
    ]
  },
  {
    path: "auth",
    loadChildren: "./modules/auth/auth.module#AuthModule"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
