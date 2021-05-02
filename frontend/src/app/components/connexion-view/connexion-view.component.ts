import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/model/doctor';
import { Patient } from 'src/app/model/patient';
import { DoctorService } from 'src/app/services/doctor.service';
import { PatientService } from 'src/app/services/patient.service';
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
              private patientService: PatientService,
              private doctorService: DoctorService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.connexionForm = this.formBuilder.group({
      email: ['elhadjp1@gmail.com', [Validators.required, Validators.email]],
      password: ['aaaaaaaaaa', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
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
          this.authService.isAuth = true;
          if (formValue['userType'] === 'medecin') {
            this.doctorService.token = data.token;
            this.doctorService.user = new Doctor(formValue['email'], formValue['password']);
            this.doctorService.user.id = data.id;
          }else {
            this.patientService.token = data.token;
            this.patientService.user = new Patient(formValue['email'], formValue['password']);
            this.patientService.user.id = data.id;
            this.patientService.loadPatientInfos();
          }
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
