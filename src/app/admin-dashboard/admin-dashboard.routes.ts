import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layout/admin-dashboard-layout/admin-dashboard-layout.component';
import { ProductsAdminPageComponent } from './pages/products-admin-page/products-admin-page.component';
import { ProductAdminFormPageComponent } from './pages/product-admin-form-page/product-admin-form-page.component';
import { BrandsAdminPageComponent } from './pages/brands-admin-page/brands-admin-page.component';
import { BrandAdminFormPageComponent } from './pages/brand-admin-form-page/brand-admin-form-page.component';
import { CategoriesAdminPageComponent } from './pages/categories-admin-page/categories-admin-page.component';
import { CategoryAdminFormPageComponent } from './pages/category-admin-form-page/category-admin-form-page.component';

export const routes: Routes = [
    {
        path:'', component:AdminDashboardLayoutComponent,
        children:[
            {path:'products',component:ProductsAdminPageComponent, title:'Lista de Productos'},
            {path:'products/form',component:ProductAdminFormPageComponent , title:'Guardar Producto'},
            {path:'products/form/:id',component:ProductAdminFormPageComponent, title:'Guardar Producto'},
            
            //marcas
            {path:'brands',component:BrandsAdminPageComponent, title:'Lista de Marcas'},
            {path:'brands/form',component:BrandAdminFormPageComponent, title:'Guardar Marca'},
            {path:'brands/form/:id',component:BrandAdminFormPageComponent, title:'Guardar Marca'},

            //categories
            {path:'categories',component:CategoriesAdminPageComponent, title:'Lista de Categorias'},
            {path:'categories/form',component:CategoryAdminFormPageComponent, title:'Guardar Categoria'},
            {path:'categories/form/:id',component:CategoryAdminFormPageComponent, title:'Guardar Categoria'},

            //default
            {path:'**',redirectTo:'products'}
        ],
        title:'Admin Dashboard'
    }
];

export default routes;