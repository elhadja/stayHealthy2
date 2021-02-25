import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-connexion-view',
  templateUrl: './connexion-view.component.html',
  styleUrls: ['./connexion-view.component.css']
})
export class ConnexionViewComponent implements OnInit {

  connexionForm: FormGroup;
  error: String = '';
  

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.connexionForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      userType: ['', Validators.required]
    });
  }

  onSubmitForm() {
    console.log("he");
    const formValue = this.connexionForm.value;
    this.authService.logUserr(formValue['email'], formValue['password'], formValue['userType'])
      .subscribe(
        (data => {
          const path = formValue['userType']==='medecin' ? '/doctor' : '/patient';
          this.router.navigate([path]);
        }),
        (error => {
          console.log(error);
          this.error = "invalide email ou mot de passe"
        })
      );
  }

  get email() {
    return this.connexionForm.get("email");
  }

  get password() {
    return this.connexionForm.get("password");
  }

}
