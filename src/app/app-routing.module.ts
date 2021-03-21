import {NgModule} from '@angular/core'
import {Routes , RouterModule} from '@angular/router'
import { CartComponent } from './Component/cart/cart.component';
import { CheckoutComponent } from './Component/checkout/checkout.component';
import { HomeComponent } from './Component/home/home.component';
import { ProductComponent } from './Component/product/product.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { LoginComponent } from './auth/components/login/login.component';

const routes : Routes = [
    {
        path:'' , component : HomeComponent
    },
    {
        path:'product/:id' , component : ProductComponent
    },
    {
        path :'cart' , component : CartComponent
    },
    {
        path:'checkout' , component : CheckoutComponent
    },
    {path: 'login', component: LoginComponent},
    
    {path: 'register', component: RegisterComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule {}