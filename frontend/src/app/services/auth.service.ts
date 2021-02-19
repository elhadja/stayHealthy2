import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  registerUser(email: String, password: String, userType: String) {
    const url = "http://localhost:3000/doctor";
    const body = {
      email: email,
      password: password,
      firstName: "bah",
      lastName: "bahhhhhhhh"
    };
    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/json',
      })
    };


    return this.http.post<any>(url, body, httpOptions)
          .pipe(
            catchError(this.handleError)
          );
  }

  handleError(error: String) {
    return throwError(error);
  }
}
