import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DoctorHomeComponent } from './pages/doctor-home/doctor-home.component';
import { EditComponent } from './pages/edit/edit.component';

const routes: Routes = [
  {path:'', component: DoctorHomeComponent }
]

@NgModule({
  declarations: [EditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class DoctorModule { }
