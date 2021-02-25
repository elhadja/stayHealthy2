import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './pages/patient/patient.component';
import { EditComponent } from './pages/edit/edit.component';

const routes: Routes = [
  { path: '', component: PatientComponent },
]


@NgModule({
  declarations: [EditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PatientModule { }
