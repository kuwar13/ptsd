import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-pcl-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgChartsModule, RouterModule],
  templateUrl: './pcl-form.component.html',
  styleUrls: ['./pcl-form.component.css']
})
export class PclFormComponent {
  questions = [
    "Repeated, disturbing memories, thoughts, or images of a stressful experience from the past?",
    "Repeated, disturbing dreams of a stressful experience from the past?",
    "Suddenly acting or feeling as if a stressful experience were happening again?",
    "Feeling very upset when something reminded you of a stressful experience?",
    "Having physical reactions when reminded of a stressful experience?",
    "Avoid thinking about or talking about a stressful experience?",
    "Avoid activities or situations that remind you of the stressful experience?",
    "Trouble remembering important parts of a stressful experience?",
    "Loss of interest in things you used to enjoy?",
    "Feeling distant or cut off from other people?",
    "Feeling emotionally numb or unable to have loving feelings?",
    "Feeling as if your future will somehow be cut short?",
    "Trouble falling or staying asleep?",
    "Feeling irritable or having angry outbursts?",
    "Having difficulty concentrating?",
    "Being “super alert” or watchful on guard?",
    "Feeling jumpy or easily startled?"
  ];

  responses: (number | null)[] = new Array(17).fill(null);
  result: any;

  constructor(private http: HttpClient) {}

  riskClass(risk: string) {
    switch (risk) {
      case 'High Risk': return 'high';
      case 'Moderate Risk': return 'moderate';
      default: return 'low';
    }
  }

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
    datasets: [
      {
        label: 'PTSD Risk Level',
        data: [0, 0, 0], // Default values
        backgroundColor: ['#2ECC40', '#FF851B', '#FF4136'],
      }
    ]
  };
  

  updateChartBasedOnRisk(risk: string) {
    // Set only one bar to the actual score value, others to 0
    const score = this.result.totalScore;
    if (risk === 'Low Risk') {
      this.chartData.datasets[0].data = [score, 0, 0];
    } else if (risk === 'Moderate Risk') {
      this.chartData.datasets[0].data = [0, score, 0];
    } else {
      this.chartData.datasets[0].data = [0, 0, score];
    }
  }
  
  
  resetForm() {
    this.responses = new Array(17).fill(null);
    this.result = null;
  }
  

  submitForm() {
    if (this.responses.includes(null)) {
      alert("Please answer all questions.");
      return;
    }

    this.http.post<any>('http://localhost:8080/api/pcl/score', {
      responses: this.responses
    }).subscribe(data => {
      this.result = data;
      this.updateChartBasedOnRisk(data.riskLevel);
    });
  }
}
