import { Component, OnInit, OnChanges, Input } from "@angular/core";
import * as c3 from "c3";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"],
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() lineChartData: any | any[];
  public sensorMAC: string = "";
  public sensorModel: string = "";
  public sensorReadDates: any[] = [];
  public internalTempSensor: any[] = [];
  public sensor1Data: any[] = [];
  public sensor2Data: any[] = [];
  public startCounter: number = 0;
  public interval: any;
  public intervalDuration: number = 0;
  public chart: any = null;

  constructor() {}

  ngOnInit() {
    //this.setData();
  }

  ngOnChanges() {
    this.setData();
  }

  setData() {
    let dateString = this.lineChartData.readDate.substring(6);
    let time = parseInt(dateString);

    this.internalTempSensor.push(this.lineChartData.InternalTemp);
    this.sensor1Data.push(this.lineChartData.ExternalTemp1);
    this.sensor2Data.push(this.lineChartData.ExternalTemp2);
    this.sensorReadDates.push(this.formatDate(new Date(time)));

    this.startGraph();
  }

  startGraph() {
    if (this.chart) {
      this.chart.flow({
        columns: [
          ["x", this.sensorReadDates[this.startCounter]],
          ["Internal Temp", this.internalTempSensor[this.startCounter]],
          ["Sensor 1", this.sensor1Data[this.startCounter]],
          ["Sensor 2", this.sensor2Data[this.startCounter]],
        ],
        length: 0,
        duration: 0,
      });
    } else {
      this.createChart();
    }

    this.startCounter++;
  }

  createChart() {
    let width = document.querySelector(".line-chart-container").getBoundingClientRect().width;
    let height = document.querySelector(".line-chart-container").getBoundingClientRect().height;

    this.chart = c3.generate({
      bindto: "#c3-chart",
      size: {
        height,
        width,
      },
      data: {
        x: "x",
        xFormat: "%Y-%m-%d %H:%M:%S",
        columns: [
          ["x", ...this.sensorReadDates],
          ["Internal Temp", ...this.internalTempSensor],
          ["Sensor 1", ...this.sensor1Data],
          ["Sensor 2", ...this.sensor2Data],
        ],
        type: "line",
      },
      transition: {
        duration: 750,
      },
      subchart: {
        show: true,
      },
      axis: {
        x: {
          extent: [0, 5],
          label: "Date/Time",
          type: "timeseries",
        },
        y: {
          label: "Temperature",
        },
      },
      tooltip: {
        format: {
          title: () => {
            return this.sensorReadDates[this.startCounter];
          },
        },
      },
    });
  }

  formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getUTCFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
