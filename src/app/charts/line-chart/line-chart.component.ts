import { Component, OnInit, Input } from "@angular/core";
import { Chart, ChartData, Point } from "chart.js";
import * as ChartZoomPlugin from "chartjs-plugin-zoom";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"],
})
export class LineChartComponent implements OnInit {
  @Input() lineChartData: any[];
  public sensorMAC: string = "";
  public sensorModel: string = "";
  public chart: Chart = null;
  public paused: boolean = false;
  public sensorReadDates: any[] = [];
  public internalTempSensor: any[] = [];
  public sensor1Data: any[] = [];
  public sensor2Data: any[] = [];
  public startCounter: number = 0;
  public interval: any;
  public zoomed: boolean = false;
  public intervalDuration: number = 0;

  constructor() {}

  ngOnInit() {
    this.setData();
  }

  handlePauseClick() {
    this.paused = !this.paused;

    if (this.paused) clearInterval(this.interval);
    else this.setData();
  }

  setData() {
    this.sensorMAC = this.lineChartData[0].MAC_Address;
    this.sensorModel = this.lineChartData[0].Model;

    this.interval = setInterval(() => {
      this.startGraph();
    }, this.intervalDuration);
  }

  startGraph() {
    let dateString: string = this.formatDate(new Date());

    if (
      this.lineChartData[this.startCounter].InternalTemp < 500 &&
      this.lineChartData[this.startCounter].ExternalTemp1 < 500 &&
      this.lineChartData[this.startCounter].ExternalTemp2 < 500
    ) {
      if (this.startCounter >= 10) {
        this.sensorReadDates.shift();
        this.internalTempSensor.shift();
        this.sensor1Data.shift();
        this.sensor2Data.shift();
      }

      this.internalTempSensor.push(
        this.lineChartData[this.startCounter].InternalTemp
      );
      this.sensor1Data.push(
        this.lineChartData[this.startCounter].ExternalTemp1
      );
      this.sensor2Data.push(
        this.lineChartData[this.startCounter].ExternalTemp2
      );
      this.sensorReadDates.push(dateString);
    }

    this.startCounter++;

    this.updateChart(
      this.sensorReadDates,
      this.internalTempSensor,
      this.sensor1Data,
      this.sensor2Data
    );

    if (this.startCounter > 4 && this.intervalDuration === 0) {
      clearInterval(this.interval);
      this.intervalDuration = 5000;
      this.setData();
    }
  }

  updateChart(sensorReadDates, internalTempSensor, sensor1Data, sensor2Data) {
    const canvas: any = document.querySelector("#line-chart");
    const ctx = canvas.getContext("2d");

    if (!this.chart) {
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: sensorReadDates,
          datasets: [
            {
              backgroundColor: "rgba(6,214,160,0.2)",
              borderColor: "rgba(6,214,160,0.2)",
              hoverBackgroundColor: "#fff",
              hoverBorderColor: "#fff",
              borderWidth: 5,
              pointBackgroundColor: "#000",
              pointBorderColor: "#000",
              pointHoverBackgroundColor: "#555",
              pointHoverBorderColor: "#555",
              pointHoverRadius: 8,
              pointRadius: 3,
              pointHitRadius: 8,
              label: "Internal Temp Sensor",
              data: internalTempSensor,
              fill: false,
              lineTension: 0.0,
            },
            {
              backgroundColor: "rgba(255,209,102,0.2)",
              borderColor: "rgba(255,209,102,0.2)",
              hoverBackgroundColor: "#fff",
              hoverBorderColor: "#fff",
              borderWidth: 5,
              pointBackgroundColor: "#000",
              pointBorderColor: "#000",
              pointHoverBackgroundColor: "#555",
              pointHoverBorderColor: "#555",
              pointHoverRadius: 8,
              pointRadius: 3,
              pointHitRadius: 8,
              label: "Sensor 1",
              data: sensor1Data,
              fill: false,
              lineTension: 0.0,
            },
            {
              backgroundColor: "rgba(15,78,133,0.2)",
              borderColor: "rgba(15,78,133,0.2)",
              hoverBackgroundColor: "#fff",
              hoverBorderColor: "#fff",
              borderWidth: 5,
              pointBackgroundColor: "#000",
              pointBorderColor: "#000",
              pointHoverBackgroundColor: "#555",
              pointHoverBorderColor: "#555",
              pointHoverRadius: 8,
              pointRadius: 3,
              pointHitRadius: 8,
              label: "Sensor 2",
              data: sensor2Data,
              fill: false,
              lineTension: 0.0,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 50,
                  max: 100,
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  max: 10,
                  suggestedMax: 10,
                },
              },
            ],
          },
          animation: {
            duration: 0,
          },
          responsive: true,
          hover: {
            intersect: true,
          },
          onHover: function(e) {
            var rect = canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;

            this.clear();
            this.draw();
            ctx.beginPath();
            ctx.moveTo(x, ctx.canvas.height);
            ctx.lineTo(x, 0);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(170,170,170,0.2)";
            ctx.stroke();
          },
          onClick: function(e) {
            let element = this.chart.getElementAtEvent(e);

            if (element.length > 0) {
              let fill = this.config.data.datasets[element[0]._datasetIndex]
                .fill;
              this.config.data.datasets[element[0]._datasetIndex].fill = !fill;
              this.chart.update();
            }
          },
          title: {
            text: `SENSOR MAC: ${this.sensorMAC} SENSOR MODEL: ${
              this.sensorModel
            }`,
          },
          legend: {
            display: true,
            onClick: function(e, legendItem) {
              let index = legendItem.datasetIndex;
              let ci = this.chart;
              let hidden = ci.config.data.datasets[index].hidden;
              ci.config.data.datasets[index].hidden = !hidden;
              ci.update();
            },
          },
          pan: {
            // Boolean to enable panning
            enabled: true,
            // Panning directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow panning in the y direction
            mode: "y",
            // Function called once panning is completed
            // Useful for dynamic data loading
            onPan: () => {
              this.zoomed = true;
            },
          },
          zoom: {
            // Boolean to enable zooming
            enabled: true,
            // Enable drag-to-zoom behavior
            drag: false,
            // Zooming directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow zooming in the y direction
            mode: "y",
            // Function called once zooming is completed
            // Useful for dynamic data loading
            onZoom: () => {
              this.zoomed = true;
            },
          },
          plugins: [ChartZoomPlugin],
        },
      });

      this.chart.update();
    } else {
      this.chart.data.labels = sensorReadDates;
      this.chart.data.datasets[0].data = internalTempSensor;
      this.chart.data.datasets[1].data = sensor1Data;
      this.chart.data.datasets[2].data = sensor2Data;

      this.chart.update();
    }
  }

  resetZoom() {
    this.chart.resetZoom();
    this.zoomed = false;
  }

  formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getUTCFullYear();

    return `${date.toLocaleTimeString()}`;
  }
}
