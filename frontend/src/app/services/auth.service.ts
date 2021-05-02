import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { PatientService } from './patient.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuth : boolean = false;
  constructor(private http: HttpClient,
              private patientService: PatientService,
              private router: Router) { }

  registerUser(email: String, password: String, userType: String) {
    const url = userType==="medecin" ? "http://localhost:3000/doctor" : "http://localhost:3000/patient";
    const body = {
      email: email,
      password: password,
    };
    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/json',
      })
    };
    return this.http.post<any>(url, body, httpOptions);
  }

  logUserr(email, password, userType) {
    const url = userType==="medecin" ? "http://localhost:3000/doctor/login" : "http://localhost:3000/patient/login";
    const body = {
      email: email,
      password: password,
    };
    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/json',
      })
    };
    return this.http.post<any>(url, body, httpOptions);
  }

  logout() {
    this.patientService.token = null;
    this.patientService.user = null;
    this.isAuth = false;
    this.router.navigate(['/login']);
  }


  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
