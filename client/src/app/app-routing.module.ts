import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import { ErrorComponent } from './components/error.component';
import { LoginComponent } from './components/login.component';
import { MainComponent } from './components/main.component';
import { DeauthService } from './deauth.service';

const routes: Routes = [
  {path:"", component: LoginComponent},
  {path:"main", component: MainComponent, canActivate: [AuthService], canDeactivate: [DeauthService]},
  {path:"error", component: ErrorComponent},
  {path:"**", redirectTo:"/", pathMatch:"full"},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
