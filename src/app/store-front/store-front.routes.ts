import { Routes } from '@angular/router';
import { StoreFrontLayoutComponent } from './layout/store-front-layout/store-front-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductDetailsPageComponent } from './pages/product-details-page/product-details-page.component';
import { EditProfilePageComponent } from './pages/edit-profile-page/edit-profile-page.component';
import { ChangePasswordPageComponent } from './pages/change-password-page/change-password-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { MyOrdersPageComponent } from './pages/my-orders-page/my-orders-page.component';
import { storeGuard } from './guards/store.guard';

const routes: Routes = [
  {
    path: '', component: StoreFrontLayoutComponent, children: [
      { path: 'home', component: HomePageComponent, title: 'Bienvenido a TechStore' },
      {
        path: 'checkout', component: CheckoutPageComponent, title: 'Checkout | TechStore',
        canActivate: [storeGuard]
      },
      { path: 'product-details/:id', component: ProductDetailsPageComponent },
      {
        path: 'edit-profile/password', component: ChangePasswordPageComponent, title: 'Cambiar contraseña | TechStore',
        canActivate: [storeGuard]
      },
      {
        path: 'edit-profile/:id', component: EditProfilePageComponent, title: 'Editar mi perfil | TechStore',
        canActivate: [storeGuard]
      },
      {
        path: 'my-orders', component: MyOrdersPageComponent, title: 'Mis Pedidos | TechStore',
        canActivate: [storeGuard]
      },
      { path: '**', redirectTo: 'home' },
    ]
  },
];

export default routes;
