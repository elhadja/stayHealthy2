import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../model/appointment';

@Injectable({
  providedIn: 'root'
})
export class SlotApiService {
  baseUrl : string = "http://localhost:3000/slot";

  constructor(private http: HttpClient) { }


  public getDoctorSlots(id: string, httpOptions): Observable<any> {
    return this.http.get<Appointment[]>(this.baseUrl + "s/" + id, httpOptions);
  }
}
