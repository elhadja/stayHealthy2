import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../model/patient';
import { Appointment } from '../model/appointment';
import { DoctorApiService } from '../api/doctorApi.service';
import { Observable } from 'rxjs';
import { Doctor } from '../model/doctor';
import { SlotApiService } from '../api/slot-api.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  public user: Patient;
  public token: string;
  private appointments: Appointment[];
  private lastAppointments: Array<Appointment>;
  private nextAppointments: Array<Appointment>;

  constructor(private router: Router,
              private http: HttpClient,
              private doctorApi: DoctorApiService,
              private slotApi: SlotApiService
              ) {
  }

  getAppointments() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'bearer ' + this.token
      })
    };
    return this.http.get<Appointment[]>("http://localhost:3000/appointments/patient", httpOptions);
  }

  getDoctor(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'bearer ' + this.token
      })
    };
    return this.http.get<any>("http://localhost:3000/doctor/" + id, httpOptions);
  }

  getDoctorsByCriteria(name: string): Observable<Doctor[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'bearer ' + this.token
      })
    };
    return this.doctorApi.getDoctorsByCriteria(name, httpOptions);
  }

  public getPatient(): Patient {
    return this.user;
  }

  public loadPatientInfos(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'bearer ' + this.token
      })
    };
    this.http.get<Patient>("http://localhost:3000/patient/" + this.user.id, httpOptions)
      .subscribe(
        (patient) => {
          this.user = patient;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  loadDoctorSlots(doctorId: string): Observable<Appointment[]>{
     const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'bearer ' + this.token
      })
    };
    return this.slotApi.getDoctorSlots(doctorId, httpOptions);
  }
}
