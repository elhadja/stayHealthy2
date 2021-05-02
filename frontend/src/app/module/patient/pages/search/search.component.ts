import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Doctor } from 'src/app/model/doctor';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  nameCriteriaControl = new FormControl();
  localityCriteriaControl = new FormControl();
  options1: string[] = ["java", "nodeJs", "js", "angular"];
  options2: string[] = ["Talence", "bayonne", "paris", "bordeaux"];
  doctors: Doctor[];
  nameCriteria: string;

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
  }

  search(): void {
    console.log(this.nameCriteriaControl.value);
    console.log(this.localityCriteriaControl.value);
    this.patientService.getDoctorsByCriteria("julien")
      .subscribe(
        (doctors) => {
          this.doctors = doctors;
          console.log(doctors);
        }
      )
  }
}
