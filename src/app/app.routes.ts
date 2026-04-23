import { Routes } from '@angular/router';
import { adminGuard } from './admin-dashboard/guards/admin.guard';

export const routes: Routes = [
    {
        path:'auth', loadChildren:()=> import('./auth/auth.routes')
    },  
    {
        path:'admin', loadChildren:()=> import('./admin-dashboard/admin-dashboard.routes'), canActivate:[adminGuard]
    },
    {
        path:'', loadChildren:()=> import('./store-front/store-front.routes')
    },

    {path:'**', redirectTo:''}
];
