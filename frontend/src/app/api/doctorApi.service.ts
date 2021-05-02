import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorApiService {
  baseUrl : string = "http://localhost:3000/doctor";

  constructor(public http: HttpClient) { }

  public getDoctorById(id: number, httpOptions): Observable<any> {
    return this.http.get<any>(this.baseUrl + "/" + id, httpOptions);
  }

  public getDoctorsByCriteria(name: string, httpOptions): Observable<any> {
    return this.http.get<any>(this.baseUrl + "s?name=" + name, httpOptions);
  }
}
