import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnexionViewComponent } from './connexion-view.component';

describe('ConnexionViewComponent', () => {
  let component: ConnexionViewComponent;
  let fixture: ComponentFixture<ConnexionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnexionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnexionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
