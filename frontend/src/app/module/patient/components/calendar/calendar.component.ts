import { NodeWithI18n } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { last } from 'rxjs/operators';
import { Appointment } from 'src/app/model/appointment';
import { PatientService } from 'src/app/services/patient.service';

export interface STDate {
  dayNumber: number;
  dayString: string;
  month: string;
  monthNumber: number
  year: number
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input()
  doctorId: string;

  dates: STDate[];
  slotsByDay: Map<string, Appointment[]>;
  months: string[];
  days: string[];
  lastDay: number;


  constructor(private patientService: PatientService) {
    this.dates = [];
    this.slotsByDay = new Map();
    this.months = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octombre",  "novembre", "decembre"];
    this.days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  }

  ngOnInit(): void {
    for (let i=0; i<6; i++) {
      this.dates.push(this.getDateFromToDay(i));
    }
    this.lastDay = 6;

    this.loadDoctorSlots();
  }

  getDateFromToDay(day: number): STDate{
    let now = new Date(new Date().setDate(new Date().getDate() + day))
    let date : STDate = {
      dayNumber: now.getDate(),
      dayString: this.days[now.getDay()],
      month: this.months[(now.getMonth())],
      monthNumber: now.getMonth(),
      year: now.getFullYear()
    };
    return date;
  }

  getSlotsByDay(date: STDate): Appointment[]{
    const key = date.dayNumber + "-" + (date.monthNumber+1) + "-" + date.year;
    console.log(key);
    return this.slotsByDay.get(key);
  }

  next(): void{
    this.dates.length = 0;
    for (let i=this.lastDay; i<this.lastDay+6; i++) {
      this.dates.push(this.getDateFromToDay(i));
    }
    this.lastDay += 6;
  }

  before(): void{
    if (this.lastDay - 12 >= 0) {
      this.lastDay -= 12;
      this.dates.length = 0;
      for (let i=this.lastDay; i<this.lastDay+6; i++) {
        this.dates.push(this.getDateFromToDay(i));
      }
      this.lastDay += 6;
    }
  }

  loadDoctorSlots() {
    console.log(this.doctorId);
    this.patientService.loadDoctorSlots("5fff4679273a5fd75ba28f64")
      .subscribe(
        (slots) => {
          for (let slot of slots) {
            if (!this.isPassedDate(slot.date)) {
              this.addToMap(slot);
            }
          }
          console.log(this.slotsByDay);
        }
      )
  }

  private addToMap(slot): void {
    const key = slot.date.jj + "-" + (slot.date.mm - 1) + "-" + slot.date.yy;
    if (!this.slotsByDay.has(key)) {
      this.slotsByDay.set(key, new Array());
    } 
    this.slotsByDay.get(key).push(slot);
  }

  private isPassedDate(date): boolean {
    const now = new Date();
    const currentDate = new Date();
    if (date.yy < currentDate.getFullYear()) {
      return true;
    }
    else if (date.mm < currentDate.getMonth())
      return true;
    else if (date.jj < currentDate.getDay())
      return true;
    return false;
  }
}