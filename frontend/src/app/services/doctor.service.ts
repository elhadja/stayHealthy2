import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient } from '../model/patient';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  public user: Patient;
  public token: String;

  constructor(private http: HttpClient) { }

}
