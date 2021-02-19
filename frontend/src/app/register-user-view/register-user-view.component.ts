import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-register-user-view',
  templateUrl: './register-user-view.component.html',
  styleUrls: ['./register-user-view.component.css']
})
export class RegisterUserViewComponent implements OnInit {
  email : string;
  password : string;
  passwordAgain : string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    console.log("formulaire soumis");
    const email = form.value['email'];
    const password = form.value['password'];
    
    this.authService.registerUser(email, password, "patient").subscribe();
  }

}
