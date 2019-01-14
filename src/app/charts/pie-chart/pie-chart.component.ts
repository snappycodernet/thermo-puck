import { Chart } from "chart.js";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.css"],
})
export class PieChartComponent implements OnInit {
  constructor() {}

  @Input() pieChartData: any[];
  public interval: any;
  public intervalDuration: number = 5000;
  public range: number = 0;
  public startCounter: number = 0;
  public chart: Chart = null;
  public pieChartLabels: string[] = ["Current"];

  ngOnInit() {
    this.setData();
  }

  setData() {
    this.interval = setInterval(() => {
      this.startGraph();
    }, this.intervalDuration);
  }

  startGraph() {
    this.range = Math.abs(
      this.pieChartData[this.startCounter].RangeSensorReading
    );
    this.startCounter++;
    this.updateChart();
  }

  updateChart() {
    const canvas: any = document.querySelector("#pie-chart");
    const ctx = canvas.getContext("2d");
    console.log(ctx);

    if (!this.chart) {
      let centerTextPlugin = {
        beforeDraw: chart => {
          var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;
          ctx.restore();
          var fontSize = (height / 5).toFixed(2);
          ctx.font = fontSize + "px Arial";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#fff";
          var text = this.range + "%",
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;
          ctx.fillText(text, textX, textY);
          ctx.save();
        },
      };

      this.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: this.pieChartLabels,
          datasets: [
            {
              backgroundColor: ["limegreen", "#eee"],
              data: [this.range, 100 - this.range],
            },
          ],
        },
        plugins: [centerTextPlugin],
        options: {
          cutoutPercentage: 75,
          legend: {
            display: false,
          },
          centerText: {
            color: "#fff",
          },
          responsive: true,
        },
      });

      this.chart.update();
    } else {
      if (this.range <= 25) {
        this.chart.data.datasets[0].backgroundColor = ["red", "#eee"];
      } else if (this.range <= 50) {
        this.chart.data.datasets[0].backgroundColor = ["gold", "#eee"];
      } else if (this.range <= 75) {
        this.chart.data.datasets[0].backgroundColor = ["#a6f224", "#eee"];
      } else {
        this.chart.data.datasets[0].backgroundColor = ["limegreen", "#eee"];
      }
      this.chart.data.datasets[0].data = [this.range, 100 - this.range];

      this.chart.update();
    }
  }
}
