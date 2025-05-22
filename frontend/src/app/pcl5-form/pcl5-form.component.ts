import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';



@Component({
  selector: 'app-pcl5-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgChartsModule, RouterModule],
  templateUrl: './pcl5-form.component.html',
  styleUrl: './pcl5-form.component.css'
})
export class Pcl5FormComponent {
  questions = [
    "Repeated, disturbing, and unwanted memories of the stressful experience?",
    "Repeated, disturbing dreams of the stressful experience?",
    "Suddenly feeling or acting as if the stressful experience were actually happening again?",
    "Feeling very upset when something reminded you of the stressful experience?",
    "Having strong physical reactions when reminded (e.g., heart pounding, trouble breathing)?",
    "Avoiding memories, thoughts, or feelings related to the stressful experience?",
    "Avoiding external reminders (e.g., people, places, conversations)?",
    "Trouble remembering important parts of the stressful experience?",
    "Having strong negative beliefs about yourself, others, or the world?",
    "Blaming yourself or someone else for the stressful experience?",
    "Having strong negative feelings such as fear, anger, guilt, or shame?",
    "Loss of interest in activities you used to enjoy?",
    "Feeling distant or cut off from others?",
    "Trouble experiencing positive feelings?",
    "Irritable behavior, angry outbursts, or acting aggressively?",
    "Taking too many risks or doing harmful things?",
    "Being 'superalert' or watchful?",
    "Feeling jumpy or easily startled?",
    "Having difficulty concentrating?",
    "Trouble falling or staying asleep?"
  ];




  responses: (number | null)[] = new Array(20).fill(null);
  result: any;

  constructor(private http: HttpClient) {}

  riskClass(risk: string) {
    switch (risk) {
      case 'High Risk': return 'high';
      case 'Moderate Risk': return 'moderate';
      case 'Low Risk': return 'low';
      default: return 'safe';  // For "No PTSD"
    }
  }

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['No PTSD', 'Low Risk', 'Moderate Risk', 'High Risk'],
    datasets: [
      {
        label: 'PTSD Risk Level',
        data: [0, 0, 0, 0],
        backgroundColor: ['#00cc88', '#2ECC40', '#FF851B', '#FF4136']
      }
    ]
  };

  updateChartBasedOnRisk(risk: string) {
    const score = this.result.totalScore;
    if (risk === 'No PTSD') {
      this.chartData.datasets[0].data = [score, 0, 0, 0];
    } else if (risk === 'Low Risk') {
      this.chartData.datasets[0].data = [0, score, 0, 0];
    } else if (risk === 'Moderate Risk') {
      this.chartData.datasets[0].data = [0, 0, score, 0];
    } else {
      this.chartData.datasets[0].data = [0, 0, 0, score];
    }

   
  }

  resetForm() {
    this.responses = new Array(20).fill(null);
    this.result = null;
    this.chartData.datasets[0].data = [0, 0, 0, 0];
  }

  submitForm() {
    if (this.responses.includes(null)) {
      alert("Please answer all questions.");
      return;
    }

    this.http.post<any>('http://localhost:8080/api/pcl/pcl-5/score', {
      responses: this.responses
    }).subscribe(data => {
      this.result = data;
      this.updateChartBasedOnRisk(data.riskLevel);
    });
  }
}
