import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RegisterUserViewComponent } from './register-user-view/register-user-view.component';
import { AuthService } from './services/auth.service';
import { ConnexionViewComponent } from './connexion-view/connexion-view.component';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  { path: '', component: ConnexionViewComponent },
  { path: 'login', component: ConnexionViewComponent },
  { path: 'signup', component: RegisterUserViewComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    RegisterUserViewComponent,
    ConnexionViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
