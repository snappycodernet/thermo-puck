import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { Chart, ChartData, Point } from "chart.js";
import * as ChartZoomPlugin from "chartjs-plugin-zoom";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"],
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() lineChartData: any | any[];
  public sensorSerial: string = "";
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
    Chart.defaults.global.defaultFontColor = "#d4d6d8";
    Chart.defaults.global.defaultFontSize = 16;
    Chart.defaults.global.defaultFontFamily = "Helvetica";
    //this.setData();
  }

  ngOnChanges() {
    if (this.lineChartData instanceof Array) {
      this.setData();
    } else {
      this.startGraph();
    }
  }

  handlePauseClick() {
    this.paused = !this.paused;

    if (this.paused) clearInterval(this.interval);
    else this.setData();
  }

  setData() {
    if (this.lineChartData instanceof Array) {
      this.interval = setInterval(() => {
        this.startGraph();
      }, this.intervalDuration);
    }
  }

  startGraph() {
    let dateString: string = this.formatDate(new Date());

    if (this.lineChartData instanceof Array) {
      this.internalTempSensor.push(this.lineChartData[this.startCounter].InternalTemp);
      this.sensor1Data.push(this.lineChartData[this.startCounter].ExternalTemp1);
      this.sensor2Data.push(this.lineChartData[this.startCounter].ExternalTemp2);
      this.sensorSerial = this.lineChartData[this.startCounter].Serial;
      this.sensorModel = this.lineChartData[this.startCounter].Model;
    } else {
      this.internalTempSensor.push(this.lineChartData.InternalTemp);
      this.sensor1Data.push(this.lineChartData.ExternalTemp1);
      this.sensor2Data.push(this.lineChartData.ExternalTemp2);
      this.sensorSerial = this.lineChartData.Serial;
      this.sensorModel = this.lineChartData.Model;
    }

    if (this.startCounter >= 99) {
      this.sensorReadDates.shift();
      this.internalTempSensor.shift();
      this.sensor1Data.shift();
      this.sensor2Data.shift();
    }

    this.sensorReadDates.push(dateString);

    this.startCounter++;

    this.updateChart(
      this.sensorReadDates,
      this.internalTempSensor,
      this.sensor1Data,
      this.sensor2Data
    );

    if (
      this.startCounter > 4 &&
      this.intervalDuration === 0 &&
      this.lineChartData instanceof Array
    ) {
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
              backgroundColor: "rgb(23, 239, 124)",
              borderColor: "rgb(23, 239, 124)",
              hoverBackgroundColor: "#fff",
              hoverBorderColor: "#fff",
              borderWidth: 5,
              pointBackgroundColor: "rgb(23, 239, 124)",
              //pointBorderColor: "#000",
              //pointHoverBackgroundColor: "#555",
              //pointHoverBorderColor: "#555",
              //pointHoverRadius: 5,
              pointRadius: 0,
              //pointHitRadius: 5,
              label: "Internal\t",
              data: internalTempSensor,
              fill: false,
              lineTension: 0.0,
            },
            {
              backgroundColor: "rgb(255, 186, 25)",
              borderColor: "rgb(255, 186, 25)",
              hoverBackgroundColor: "#fff",
              hoverBorderColor: "#fff",
              borderWidth: 5,
              pointBackgroundColor: "rgb(255, 186, 25)",
              //pointBorderColor: "#000",
              //pointHoverBackgroundColor: "#555",
              //pointHoverBorderColor: "#555",
              //pointHoverRadius: 5,
              pointRadius: 0,
              //pointHitRadius: 5,
              label: "Top\t",
              data: sensor1Data,
              fill: false,
              lineTension: 0.0,
            },
            {
              backgroundColor: "rgb(27, 191, 232)",
              borderColor: "rgb(27, 191, 232)",
              hoverBackgroundColor: "#fff",
              hoverBorderColor: "#fff",
              borderWidth: 5,
              pointBackgroundColor: "rgb(27, 191, 232)",
              //pointBorderColor: "#000",
              //pointHoverBackgroundColor: "#555",
              //pointHoverBorderColor: "#555",
              //pointHoverRadius: 5,
              pointRadius: 0,
              //pointHitRadius: 5,
              label: "Bottom",
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
                  min: 40,
                  max: 120,
                  fontStyle: "bold",
                },
                scaleLabel: {
                  display: true,
                  labelString: "Temperature °F",
                  fontSize: 20,
                  fontStyle: "bold",
                },
                gridLines: {
                  display: true,
                  color: "#636363",
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  max: 100,
                  suggestedMax: 100,
                  fontSize: 12,
                },
                gridLines: {
                  display: true,
                  color: "#636363",
                },
              },
            ],
          },
          animation: {
            duration: 0,
          },
          tooltips: {
            mode: "label",
            intersect: false,
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
              let fill = this.config.data.datasets[element[0]._datasetIndex].fill;
              this.config.data.datasets[element[0]._datasetIndex].fill = !fill;
              this.chart.update();
            }
          },
          title: {
            text: `Ascentec Engineering Sensor Model: ${this.sensorModel.toUpperCase()}    s/n: ${
              this.sensorSerial
            }`,
            fontSize: 24,
            display: true,
          },
          legend: {
            display: true,
            labels: {
              boxWidth: 75,
              fontStyle: "bold",
            },
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
            mode: "xy",
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
      this.chart.options.title.text = `Ascentec Engineering Sensor Model: ${this.sensorModel.toUpperCase()}    s/n: ${
        this.sensorSerial
      }`;

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
