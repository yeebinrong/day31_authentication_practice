import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from './api.service';

import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './components/main.component';
import { LoginComponent } from './components/login.component';
import { AuthService } from './auth.service';
import { ErrorComponent } from './components/error.component';
import { DeauthService } from './deauth.service';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
  ],
  providers: [ApiService, AuthService, DeauthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
