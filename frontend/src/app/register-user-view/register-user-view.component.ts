import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-register-user-view',
  templateUrl: './register-user-view.component.html',
  styleUrls: ['./register-user-view.component.css']
})
export class RegisterUserViewComponent implements OnInit {
  error : string = '';
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
      const email = form.value['email'];
      const password = form.value['password'];
      const userType = form.value['userType'];
      
      const res = this.authService.registerUser(email, password, userType)
      .subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        (error) => {
          this.error = error.error.message;
        }
      );
  }

  isValidForm(form: NgForm) {
    const userType = form.value['userType'];
  }

}
