import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      { path: 'login', component: LoginPageComponent },
      { path: '**', redirectTo:'login'  },
    ]

    // path:'login',component: LoginPageComponent
  },
];

export default routes;