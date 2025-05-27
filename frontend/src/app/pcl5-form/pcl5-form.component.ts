import { Component, OnInit }            from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { FormsModule }                  from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule }                 from '@angular/router';
import { ChartConfiguration }           from 'chart.js';
import { NgChartsModule }               from 'ng2-charts';
import * as tf                          from '@tensorflow/tfjs';



@Component({
  selector: 'app-pcl5-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule,
    RouterModule
  ],
  templateUrl: './pcl5-form.component.html',
  styleUrls: ['./pcl5-form.component.css']
})
export class Pcl5FormComponent implements OnInit {
  // ─── The 20 PCL-5 questions ───
  questions = [
    "Repeated, disturbing, and unwanted memories of the stressful experience?",
    "Repeated, disturbing dreams of the stressful experience?",
    "Suddenly feeling or acting as if the stressful experience were happening again?",
    "Feeling very upset when something reminded you of the stressful experience?",
    "Having strong physical reactions when reminded (e.g., heart pounding)?",
    "Avoiding memories, thoughts, or feelings related to the stressful experience?",
    "Avoiding external reminders (e.g., people, places, conversations)?",
    "Trouble remembering important parts of the stressful experience?",
    "Having strong negative beliefs about yourself, others, or the world?",
    "Blaming yourself or someone else for the stressful experience?",
    "Having strong negative feelings such as fear, anger, guilt, or shame?",
    "Loss of interest in activities you used to enjoy?",
    "Feeling distant or cut off from other people?",
    "Trouble experiencing positive feelings?",
    "Irritable behavior, angry outbursts, or acting aggressively?",
    "Taking too many risks or doing things that could harm you?",
    "Being 'superalert,' watchful, or on guard?",
    "Feeling jumpy or easily startled?",
    "Having difficulty concentrating?",
    "Trouble falling or staying asleep?"
  ];

  // ─── Form state ───
  responses: (number | null)[] = new Array(20).fill(null);
  result: any;

  // ─── Demographics & history inputs ───
  score3!: number; // 3 months ago
  score2!: number; // 2 months ago
  score1!: number; // last month
  currentScore!: number;   // f0, the latest PCL-5 total
  age!: number;
  gender!: number;      // 0 = female, 1 = male
  workHours!: number;
  sleepHours!: number;
  exerciseHours!: number;
  socialSupport!: number;  // 0–4 scale

  // ─── Chart data ───
  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['No PTSD','Low Risk','Moderate Risk','High Risk'],
    datasets: [{
      label: 'PTSD Risk Level',
      data: [0,0,0,0],
      backgroundColor: ['#00cc88','#2ECC40','#FF851B','#FF4136']
    }]
  };
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['3 mo ago','2 mo ago','Last mo','Current','Predicted'],
    datasets: [{
      label: 'PCL-5 Score Trend',
      data: [],           // will fill in onPredict()
      fill: false,
      tension: 0.4
    }]
  };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      y: { min: 0, max: 80 }
    }
  };


  // ─── TensorFlow artifacts ───
  private dataMin!: tf.Tensor;
  private dataMax!: tf.Tensor;
  private model!: tf.Sequential;
  modelReady = false;

  // ─── Prediction outputs ───
  predictedScore?: number;
  predictedRisk?: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
   // this.prepareAndTrainModel().then(() => this.modelReady = true);
  }

  /** Training regression model on SAMPLE_DATA */
  // private async prepareAndTrainModel() {
  //   const inputs = SAMPLE_DATA.map(d => d.features);
  //   const labels = SAMPLE_DATA.map(d => d.label);
  //   const inputTensor = tf.tensor2d(inputs);
  //   const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

  //   this.dataMin = inputTensor.min(0);
  //   this.dataMax = inputTensor.max(0);
  //   const normInputs = inputTensor.sub(this.dataMin)
  //                                 .div(this.dataMax.sub(this.dataMin));

  //   this.model = tf.sequential();
  //   this.model.add(tf.layers.dense({ inputShape:[10], units:16, activation:'relu' }));
  //   this.model.add(tf.layers.dense({ units:8, activation:'relu' }));
  //   this.model.add(tf.layers.dense({ units:1, activation:'linear' }));
  //   this.model.compile({ optimizer:'adam', loss:'meanSquaredError' });

  //   await this.model.fit(normInputs, labelTensor, {
  //     epochs: 500,
  //     shuffle: true,
  //     callbacks: { onEpochEnd: (ep, logs) => console.log(`Epoch ${ep}: loss=${logs?.['loss']}`) }
  //   });
  // }

  /** Submit PCL-5 form to backend for current score */
  submitForm() {
    if (this.responses.includes(null)) {
      alert('Please answer all questions.');
      return;
    }
    this.http.post<any>('http://localhost:8080/api/pcl/pcl-5/score', { responses: this.responses })
      .subscribe(data => {
        this.result = data;
        this.updateChartBasedOnRisk(data.riskLevel);
      });
  }

  /** Update the 4-bar chart based on current risk */
  private updateChartBasedOnRisk(risk: string) {
    const s = this.result.totalScore;
    this.chartData.datasets[0].data = [
      risk === 'No PTSD'      ? s : 0,
      risk === 'Low Risk'     ? s : 0,
      risk === 'Moderate Risk'? s : 0,
      risk === 'High Risk'    ? s : 0
    ];
  }

  /** Reset form, chart, and predictions */
  resetForm() {
    this.responses = new Array(20).fill(null);
    this.result    = null;
    this.predictedScore = undefined;
    this.predictedRisk  = undefined;
    this.chartData.datasets[0].data = [0,0,0,0];
  }

  /** Called by “Predict Future PTSD Risk” button */
async onPredict() {

  if (!this.result) {
    alert('Please submit the PCL-5 assessment first.');
    return;
  }

  const pts = [
    { x: -3, y: this.score3 },
    { x: -2, y: this.score2 },
    { x: -1, y: this.score1 },
    { x:  0, y: this.result.totalScore }
  ];
  const n     = pts.length;
  const sumX  = pts.reduce((s,p) => s + p.x,  0);
  const sumY  = pts.reduce((s,p) => s + p.y,  0);
  const sumXY = pts.reduce((s,p) => s + p.x*p.y, 0);
  const sumX2 = pts.reduce((s,p) => s + p.x*p.x, 0);

  const m = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX);
  const b = (sumY - m*sumX) / n;

  // extrapolate to t=1
  let next = m*1 + b;
  next = Math.max(0, Math.min(80, next));

  this.predictedScore = next;
  this.predictedRisk  = this.getRiskLevelForPcl5(Math.round(next));

  this.lineChartData.datasets[0].data = [
    this.score3,
    this.score2,
    this.score1,
    this.result.totalScore,
    next
  ];
}


  /** same cutoffs as your Java backend */
  private getRiskLevelForPcl5(score: number): string {
    if (score >= 60) return 'High Risk';
    if (score >= 44) return 'Moderate Risk';
    if (score >= 32) return 'Low Risk';
    return 'No PTSD';
  }

  /** Styling helper for result banner */
  riskClass(risk: string) {
    switch (risk) {
      case 'High Risk':     return 'high';
      case 'Moderate Risk': return 'moderate';
      case 'Low Risk':      return 'low';
      default:              return 'safe';
    }
  }
}
