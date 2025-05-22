import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PclFormComponent } from './pcl-form.component';

describe('PclFormComponent', () => {
  let component: PclFormComponent;
  let fixture: ComponentFixture<PclFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PclFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PclFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
