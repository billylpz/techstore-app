import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      { path: 'login', component: LoginPageComponent,  title: 'TechStore | Login'},
      { path: 'register', component: RegisterPageComponent, title: 'TechStore | Registro' },
      { path: '**', redirectTo:'login'  },
    ]
  },
];

export default routes;