import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layout/admin-dashboard-layout/admin-dashboard-layout.component';
import { ProductsAdminPageComponent } from './pages/products-admin-page/products-admin-page.component';

export const routes: Routes = [
    {
        path:'', component:AdminDashboardLayoutComponent,
        children:[
            {path:'products',component:ProductsAdminPageComponent},
            {path:'**',redirectTo:'products'}
        ],
        title:'Admin Dashboard'
    }
];

export default routes;