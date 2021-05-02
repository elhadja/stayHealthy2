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
import { AuthGuardService } from './services/auth-guard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DoctorApiService } from './api/doctorApi.service';
import { SlotApiService } from './api/slot-api.service';

const routes : Routes = [
  { path: '', component: ConnexionViewComponent },
  { path: 'login', component: ConnexionViewComponent },
  { path: 'signup', component: RegisterUserViewComponent },
  { path: 'doctor', canActivate: [AuthGuardService],loadChildren: () => import('./module/doctor/doctor.module').then(m => m.DoctorModule) },
  { path: 'patient', canActivate: [AuthGuardService],loadChildren: () => import('./module/patient/patient.module').then(m => m.PatientModule) },
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
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
  ],
  providers: [
    AuthService,
    AuthGuardService,
    PatientService,
    DoctorService,
    DoctorApiService,
    SlotApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
