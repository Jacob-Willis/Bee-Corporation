import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeeContainerComponent } from './bee-container.component';

describe('BeeContainerComponent', () => {
  let component: BeeContainerComponent;
  let fixture: ComponentFixture<BeeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
