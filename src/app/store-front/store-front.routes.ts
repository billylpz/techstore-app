import { Routes, RouterModule } from '@angular/router';
import { StoreFrontLayoutComponent } from './layout/store-front-layout/store-front-layout.component';

const routes: Routes = [
  { path: '', component: StoreFrontLayoutComponent , children:[
    
  ] },
];

export default routes;
