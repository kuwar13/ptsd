import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pcl5FormComponent } from './pcl5-form.component';

describe('Pcl5FormComponent', () => {
  let component: Pcl5FormComponent;
  let fixture: ComponentFixture<Pcl5FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pcl5FormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pcl5FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
