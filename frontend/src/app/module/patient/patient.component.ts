import { parseSelectorToR3Selector } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { Appointment } from 'src/app/model/appointment';
import { Doctor } from 'src/app/model/doctor';
import { DoctorService } from 'src/app/services/doctor.service';
import { PatientService } from 'src/app/services/patient.service';
import { DialogAppointmentComponent } from './components/other/dialog-appointment/dialog-appointment.component';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  nextAppointments = new Array<Appointment>();
  lastAppointments = new Array<Appointment>();
  doctorsInfos = new Map<String,Doctor>();
  selectedAppointment : Appointment;
  isAppointmentsLoaded : Boolean;

  constructor(private patientService: PatientService,
              private doctorService: DoctorService,
              public dialog: MatDialog) {
      this.isAppointmentsLoaded = false;
  }

  ngOnInit(): void {
    this.patientService.getAppointments().subscribe(
      (data) => {
        for (let appoitment of data)
          this.help(appoitment);
        console.log(this.doctorsInfos);
      },
      (error) => {
        console.log(error);
    });
    setTimeout(() => {
      this.isAppointmentsLoaded = true;
    }, 500);
  }

  isPastAppointment(appointment: Appointment): boolean {
    const currentDate = new Date();
    if (appointment.date.yy < currentDate.getFullYear()) {
      return true;
    }
    else if (appointment.date.mm < currentDate.getMonth() && appointment.date.mm !== 0)
      return true;
    else if (appointment.date.jj < currentDate.getDay())
      return true;
    return false;
  }

  help(appointment: Appointment): void {
    if (this.isPastAppointment(appointment))
      this.lastAppointments.push(appointment);
    else
      this.nextAppointments.push(appointment);
    if (!this.doctorsInfos.has(appointment.doctorId)) {
      this.patientService.getDoctor(appointment.doctorId)
        .subscribe(
          data => {
            this.doctorsInfos.set(appointment.doctorId, data);
          },
          error => {
            console.log(error);
          }
        )
    }
  }

  public onShowAppointmentInfos(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }

  public toogleDialog(appointment: Appointment) {
    const dialogRef = this.dialog.open(DialogAppointmentComponent, {
      data: {appointment: appointment}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
