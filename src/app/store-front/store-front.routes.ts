import { Routes} from '@angular/router';
import { StoreFrontLayoutComponent } from './layout/store-front-layout/store-front-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductDetailsPageComponent } from './pages/product-details-page/product-details-page.component';
import { EditProfilePageComponent } from './pages/edit-profile-page/edit-profile-page.component';
import { ChangePasswordPageComponent } from './pages/change-password-page/change-password-page.component';

const routes: Routes = [
  {
    path: '', component: StoreFrontLayoutComponent, children: [
      {path:'home',component:HomePageComponent},
      {path:'product-details/:id',component:ProductDetailsPageComponent},
      {path:'edit-profile/password',component:ChangePasswordPageComponent},
      {path:'edit-profile/:id',component:EditProfilePageComponent},
      {path:'**',redirectTo:'home'},
    ]
  },
];

export default routes;
