import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { CartComponent } from './features/cart/cart.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { MyAccountComponent } from './features/my-account/my-account.component';
import { MyAddressesComponent } from './features/my-account/my-addresses/my-addresses.component';
import { SettingsComponent } from './features/my-account/settings/settings.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard } from './core/guards/auth/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'wishlist', component: WishlistComponent, canActivate: [authGuard] },
    { path: 'cart', component: CartComponent, canActivate: [authGuard] },
    {
        path: 'products',
        loadComponent: () => import('./features/shop/shop.component')
            .then(c => c.ShopComponent)
    },
    {
        path: 'support',
        loadComponent: () => import('./features/support/support.component')
            .then(c => c.SupportComponent)
    },
    {
        path: 'product-details/:id/:slug',
        loadComponent: () => import('./features/product-details/product-details.component')
            .then(c => c.ProductDetailsComponent), data: { renderMode: 'client' }
    },
    {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories.component')
            .then(c => c.CategoriesComponent)
    },
    {
        path: 'categories/:id',
        loadComponent: () => import('./features/subcategories/subcategories.component')
            .then(c => c.SubcategoriesComponent), data: { renderMode: 'client' }
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/components/forgot-password/forgot-password.component')
            .then(c => c.ForgotPasswordComponent)
    },
    {
        path: 'brands',
        loadComponent: () => import('./features/brands/brands.component')
            .then(c => c.BrandsComponent)
    },
    {
        path: 'checkout/:cartId',
        loadComponent: () => import('./features/checkout/checkout.component')
            .then(c => c.CheckoutComponent), canActivate: [authGuard], data: { renderMode: 'client' }
    },
    {
        path: 'allorders',
        loadComponent: () => import('./features/orders/orders.component')
            .then(c => c.OrdersComponent), canActivate: [authGuard]
    },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'profile', component: MyAccountComponent, children: [
            { path: '', redirectTo: 'addresses', pathMatch: 'full' },
            { path: 'addresses', component: MyAddressesComponent },
            { path: 'settings', component: SettingsComponent }
        ]
    },
    { path: '**', component: NotFoundComponent }
];
