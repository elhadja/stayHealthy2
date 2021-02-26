import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RegisterUserViewComponent } from './components/register-user-view/register-user-view.component';
import { AuthService } from './services/auth.service';
import { ConnexionViewComponent } from './components/connexion-view/connexion-view.component';
import { RouterModule, Routes } from '@angular/router';
import { PatientService } from './services/patient.service';
import { DoctorService } from './services/doctor.service';

const routes : Routes = [
  { path: '', component: ConnexionViewComponent },
  { path: 'login', component: ConnexionViewComponent },
  { path: 'signup', component: RegisterUserViewComponent },
  { path: 'doctor', loadChildren: () => import('./module/doctor/doctor.module').then(m => m.DoctorModule) },
  { path: 'patient', loadChildren: () => import('./module/patient/patient.module').then(m => m.PatientModule) },
]

@NgModule({
  declarations: [
    AppComponent,
    RegisterUserViewComponent,
    ConnexionViewComponent,
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
    PatientService,
    DoctorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
