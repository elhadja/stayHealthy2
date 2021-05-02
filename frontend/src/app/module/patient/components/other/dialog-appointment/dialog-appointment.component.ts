import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Appointment } from 'src/app/model/appointment';
import { Doctor } from 'src/app/model/doctor';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-dialog-appointment',
  templateUrl: './dialog-appointment.component.html',
  styleUrls: ['./dialog-appointment.component.css']
})
export class DialogAppointmentComponent implements OnInit {

  appointment : Appointment;
  doctor : Doctor;
  patient: Patient;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {appointment: Appointment},
              public patientService: PatientService) {
    this.appointment = data.appointment;
  }

  ngOnInit() {
    this.patient = this.patientService.user;
    console.log(this.patient);
    this.patientService.getDoctor(this.appointment.doctorId)
        .subscribe(
          (doctor) => {
            console.log(doctor);
            this.doctor = doctor;
          },
          (err) => {
            console.log = err;
          }
        )
  }

}
