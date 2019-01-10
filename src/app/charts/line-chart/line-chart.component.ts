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
  public lineChartArrayData: any[] = [];
  public sensorMAC: string = "";
  public sensorModel: string = "";
  public chart: Chart = null;
  public paused: boolean = false;

  constructor() {}

  ngOnInit() {
    this.setData();
  }

  handlePauseClick() {
    this.paused = !this.paused;
  }

  setData() {
    let sensorReadDates: any[] = [];
    let internalTempSensor: any[] = [];
    let sensor1Data: any[] = [];
    let sensor2Data: any[] = [];
    this.sensorMAC = this.lineChartData[0].MAC_Address;
    this.sensorModel = this.lineChartData[0].Model;
    let startCounter = 0;
    let endCounter = 15;

    setInterval(() => {
      if (startCounter >= 9) {
        sensorReadDates.shift();
        internalTempSensor.shift();
        sensor1Data.shift();
        sensor2Data.shift();
      }

      let dateString: string = this.formatDate(new Date());

      if (
        this.lineChartData[startCounter].InternalTemp < 500 &&
        this.lineChartData[startCounter].ExternalTemp1 < 500 &&
        this.lineChartData[startCounter].ExternalTemp2 < 500
      ) {
        internalTempSensor.push(this.lineChartData[startCounter].InternalTemp);
        sensor1Data.push(this.lineChartData[startCounter].ExternalTemp1);
        sensor2Data.push(this.lineChartData[startCounter].ExternalTemp2);
        sensorReadDates.push(dateString);
      }

      startCounter++;
      endCounter++;
      this.updateChart(
        sensorReadDates,
        internalTempSensor,
        sensor1Data,
        sensor2Data
      );
    }, 3000);
  }

  updateChart(sensorReadDates, internalTempSensor, sensor1Data, sensor2Data) {
    const canvas: any = document.querySelector("#line-chart");
    const ctx = canvas.getContext("2d");
    //ctx.canvas.width = document.querySelector(".chart").clientWidth - 5;
    //ctx.canvas.height = document.querySelector(".chart").clientHeight - 5;
    console.log(document.querySelector(".chart").clientWidth);

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
              pointRadius: 5,
              pointHitRadius: 10,
              label: "Internal Temp Sensor",
              data: internalTempSensor,
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
              pointRadius: 5,
              pointHitRadius: 10,
              label: "Sensor 1",
              data: sensor1Data,
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
              pointRadius: 5,
              pointHitRadius: 10,
              label: "Sensor 2",
              data: sensor2Data,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {},
              },
            ],
          },
          responsive: true,
          hover: {
            intersect: true,
          },
          onHover: function(e) {
            return;
          },
          onClick: function(e) {
            let element = this.chart.getElementAtEvent(e);

            console.log(element);

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
            onPan: function() {},
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
            onZoom: function() {},
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
      //this.chart.resetZoom();
    }
  }

  formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getUTCFullYear();

    return `${date.toLocaleTimeString()}`;
  }
}
