import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUserViewComponent } from './register-user-view.component';

describe('RegisterUserViewComponent', () => {
  let component: RegisterUserViewComponent;
  let fixture: ComponentFixture<RegisterUserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterUserViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
