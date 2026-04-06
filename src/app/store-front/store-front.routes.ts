import { Routes, RouterModule } from '@angular/router';
import { StoreFrontLayoutComponent } from './layout/store-front-layout/store-front-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

const routes: Routes = [
  {
    path: '', component: StoreFrontLayoutComponent, children: [
      {path:'home',component:HomePageComponent},
      {path:'**',redirectTo:'home'},
    ]
  },
];

export default routes;
