import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RegisterUserViewComponent } from './register-user-view/register-user-view.component';
import { AuthService } from './services/auth.service';
import { ConnexionViewComponent } from './connexion-view/connexion-view.component';
import { RouterModule, Routes } from '@angular/router';
import { DoctorHomeComponent } from './doctor-home/doctor-home.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';

const routes : Routes = [
  { path: '', component: ConnexionViewComponent },
  { path: 'login', component: ConnexionViewComponent },
  { path: 'signup', component: RegisterUserViewComponent },
  { path: 'doctorHome', component: DoctorHomeComponent },
  { path: 'patientHome', component: PatientHomeComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    RegisterUserViewComponent,
    ConnexionViewComponent,
    DoctorHomeComponent,
    PatientHomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
