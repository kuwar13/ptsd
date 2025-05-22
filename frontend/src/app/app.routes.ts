import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PclFormComponent } from './pclc-form/pcl-form.component';
import { Pcl5FormComponent } from './pcl5-form/pcl5-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pcl-c', component: PclFormComponent },
  { path: 'pcl-5', component: Pcl5FormComponent }
];
