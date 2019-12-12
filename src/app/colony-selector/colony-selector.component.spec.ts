import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColonySelectorComponent } from './colony-selector.component';

describe('HiveSelectorComponent', () => {
  let component: ColonySelectorComponent;
  let fixture: ComponentFixture<ColonySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColonySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColonySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
