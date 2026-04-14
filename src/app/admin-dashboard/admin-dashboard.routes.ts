import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layout/admin-dashboard-layout/admin-dashboard-layout.component';
import { UserAdminChangePasswordPageComponent } from './pages/users/user-admin-change-password-page/user-admin-change-password-page.component';
import { BrandAdminFormPageComponent } from './pages/brands/brand-admin-form-page/brand-admin-form-page.component';
import { BrandsAdminPageComponent } from './pages/brands/brands-admin-page/brands-admin-page.component';
import { CategoriesAdminPageComponent } from './pages/categories/categories-admin-page/categories-admin-page.component';
import { CategoryAdminFormPageComponent } from './pages/categories/category-admin-form-page/category-admin-form-page.component';
import { HomeAdminPageComponent } from './pages/home-admin-page/home-admin-page.component';
import { ProductAdminFormPageComponent } from './pages/products/product-admin-form-page/product-admin-form-page.component';
import { ProductsAdminPageComponent } from './pages/products/products-admin-page/products-admin-page.component';
import { UserAdminFormPageComponent } from './pages/users/user-admin-form-page/user-admin-form-page.component';
import { UsersAdminPageComponent } from './pages/users/users-admin-page/users-admin-page.component';

export const routes: Routes = [
    {
        path: '', component: AdminDashboardLayoutComponent,
        children: [
            { path: 'home', component: HomeAdminPageComponent, title: 'Bienvenido Admin' },

            { path: 'products', component: ProductsAdminPageComponent, title: 'Lista de Productos' },
            { path: 'products/form', component: ProductAdminFormPageComponent, title: 'Guardar Producto' },
            { path: 'products/form/:id', component: ProductAdminFormPageComponent, title: 'Guardar Producto' },

            //marcas
            { path: 'brands', component: BrandsAdminPageComponent, title: 'Lista de Marcas' },
            { path: 'brands/form', component: BrandAdminFormPageComponent, title: 'Guardar Marca' },
            { path: 'brands/form/:id', component: BrandAdminFormPageComponent, title: 'Guardar Marca' },

            //categories
            { path: 'categories', component: CategoriesAdminPageComponent, title: 'Lista de Categorias' },
            { path: 'categories/form', component: CategoryAdminFormPageComponent, title: 'Guardar Categoria' },
            { path: 'categories/form/:id', component: CategoryAdminFormPageComponent, title: 'Guardar Categoria' },

            //users
            { path: 'users', component: UsersAdminPageComponent, title: 'Lista de Usuarios' },
            { path: 'users/form', component: UserAdminFormPageComponent, title: 'Guardar Usuario' },
            { path: 'users/form/:id', component: UserAdminFormPageComponent, title: 'Guardar Usuario' },
            { path: 'users/edit-password', component: UserAdminChangePasswordPageComponent, title: 'Cambiar contraseña' },

            //default
            { path: '**', redirectTo: 'home' }
        ],
        title: 'Admin Dashboard'
    }
];

export default routes;