import { Chart } from "chart.js";
import { Component, OnInit, OnChanges, Input } from "@angular/core";

/*
const SAMPLE_BARCHART_DATA: any[] = [
  { data: [65, 59, 80, 81, 56, 54, 30], label: 'Q3 Sales'},
  { data: [25, 39, 60, 91, 36, 54, 50], label: 'Q4 Sales'},
];


const SAMPLE_BARCHART_LABELS: string[] = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];
*/

@Component({
  selector: "app-bar-chart",
  templateUrl: "./bar-chart.component.html",
  styleUrls: ["./bar-chart.component.css"],
})
export class BarChartComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() public barChartData: any | any[];
  public barChartLabels: string[] = [];
  public interval: any;
  public intervalDuration: number = 5000;
  public startCounter: number = 0;
  public internalTempSensor: number[] = [];
  public sensor1Data: number[] = [];
  public sensor2Data: number[] = [];
  public chart: Chart = null;
  public avgInternalTempSensor: number = 0;
  public avgSensor1: number = 0;
  public avgSensor2: number = 0;

  ngOnInit() {
    this.barChartLabels = ["Internal Sensor", "Sensor 1", " Sensor 2"];
    //this.setData();
  }

  ngOnChanges() {
    if (this.barChartData instanceof Array) {
      this.setData();
    } else {
      this.startGraph();
    }
  }

  setData() {
    if (this.barChartData instanceof Array) {
      this.interval = setInterval(() => {
        this.startGraph();
      }, this.intervalDuration);
    }
  }

  startGraph() {
    if (this.barChartData instanceof Array) {
      this.internalTempSensor.push(this.barChartData[this.startCounter].InternalTemp);
      this.sensor1Data.push(this.barChartData[this.startCounter].ExternalTemp1);
      this.sensor2Data.push(this.barChartData[this.startCounter].ExternalTemp2);
      this.startCounter++;
    } else {
      this.internalTempSensor.push(this.barChartData.InternalTemp);
      this.sensor1Data.push(this.barChartData.ExternalTemp1);
      this.sensor2Data.push(this.barChartData.ExternalTemp2);
    }

    this.avgInternalTempSensor = this.calculateAvgTemp(this.internalTempSensor);
    this.avgSensor1 = this.calculateAvgTemp(this.sensor1Data);
    this.avgSensor2 = this.calculateAvgTemp(this.sensor2Data);

    this.updateChart();
  }

  calculateAvgTemp(temps: number[]) {
    let sum: number = 0;

    temps.forEach(temp => {
      sum += temp;
    });

    return sum / temps.length;
  }

  updateChart() {
    const canvas: any = document.querySelector("#bar-chart");
    const ctx = canvas.getContext("2d");

    if (!this.chart) {
      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.barChartLabels,
          datasets: [
            {
              label: `${new Date().toString()}`,
              backgroundColor: [
                "rgba(6,214,160,0.2)",
                "rgba(255,209,102,0.2)",
                "rgba(15,78,133,0.2)",
              ],
              data: [this.avgInternalTempSensor, this.avgSensor1, this.avgSensor2],
            },
          ],
        },
        options: {
          responsive: true,
          scaleShowVerticalLines: false,
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Average Sensor Temperatures",
          },
        },
      });

      this.chart.update();
    } else {
      this.chart.data.datasets[0].data = [
        this.avgInternalTempSensor,
        this.avgSensor1,
        this.avgSensor2,
      ];
      this.chart.data.datasets[0].label = new Date().toString();

      this.chart.update();
    }
  }
}
