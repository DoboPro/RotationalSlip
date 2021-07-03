import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolidParamComponent } from './solid-param.component';

describe('SolidParamComponent', () => {
  let component: SolidParamComponent;
  let fixture: ComponentFixture<SolidParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolidParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolidParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
