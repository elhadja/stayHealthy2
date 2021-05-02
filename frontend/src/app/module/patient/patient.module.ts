import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './patient.component';
import { EditComponent } from './pages/edit/edit.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DialogAppointmentComponent } from './components/other/dialog-appointment/dialog-appointment.component';
import {MatIconModule} from '@angular/material/icon'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';



import {MatDialogModule} from '@angular/material/dialog'; 
import { MatListModule } from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { SearchComponent } from './pages/search/search.component';
import { CalendarComponent } from './components/calendar/calendar.component'; 

const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'appointments', component: PatientComponent },
  { path: 'edit', component: EditComponent },
  { path: 'nav', component: NavbarComponent },
]

@NgModule({
  declarations: [
    PatientComponent,
    EditComponent, 
    NavbarComponent, 
    DialogAppointmentComponent,
    SearchComponent,
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    FormsModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild(routes),
  ]
})
export class PatientModule { }
