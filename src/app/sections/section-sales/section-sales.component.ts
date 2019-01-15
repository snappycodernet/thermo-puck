import { Component, OnInit, Input } from "@angular/core";
import { SensorDataFetcherService } from "src/app/sensor-data-fetcher.service";

@Component({
  selector: "app-section-sales",
  templateUrl: "./section-sales.component.html",
  styleUrls: ["./section-sales.component.css"],
})
export class SectionSalesComponent implements OnInit {
  public chartData: any = null;
  public fetchingData: boolean = false;
  public interval: any;
  public intervalDuration: number = 5000;

  constructor(private fetcherService: SensorDataFetcherService) {}

  ngOnInit() {}

  getCOMData() {
    this.fetchingData = true;

    this.interval = setInterval(() => {
      this.initiateCOMFetch();
    }, this.intervalDuration);

    this.fetchingData = false;
  }

  getTextData() {
    this.fetchingData = true;
    this.fetcherService.getData().subscribe(
      data => {
        this.chartData = JSON.parse(data.toString());
        this.fetchingData = false;
      },
      err => console.error(err),
      () => {
        console.log("Done Loading Chart Data");
      }
    );
  }

  initiateCOMFetch() {
    this.fetcherService.getComPortData().subscribe(
      data => {
        this.chartData = JSON.parse(data.toString());
      },
      err => console.error(err),
      () => {
        console.log("Done Loading Chart Data");
      }
    );
  }
}
