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

    this.startCounter++;

    this.startGraph();
  }

  startGraph() {
    if (this.chart) {
      this.chart.load({
        columns: [
          ["Internal Temp", ...this.internalTempSensor],
          ["Sensor 1", ...this.sensor1Data],
          ["Sensor 2", ...this.sensor2Data],
        ],
      });
    } else {
      this.createChart();
    }
  }

  createChart() {
    this.chart = c3.generate({
      bindto: "#c3-chart",
      data: {
        columns: [
          ["Internal Temp", ...this.internalTempSensor],
          ["Sensor 1", ...this.sensor1Data],
          ["Sensor 2", ...this.sensor2Data],
        ],
        type: "line",
      },
      subchart: {
        show: true,
      },
      axis: {
        x: {
          extent: [0],
          label: "Date/Time",
        },
        y: {
          label: "Temperature",
        },
      },
      tooltip: {
        format: {
          title: function(d) {
            return d;
          },
        },
      },
    });
  }

  formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getUTCFullYear();

    return `${date.toLocaleTimeString()}`;
  }
}
