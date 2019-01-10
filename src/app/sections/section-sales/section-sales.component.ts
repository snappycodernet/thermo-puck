import { Component, OnInit, Input } from "@angular/core";
import { SensorDataFetcherService } from "src/app/sensor-data-fetcher.service";

@Component({
  selector: "app-section-sales",
  templateUrl: "./section-sales.component.html",
  styleUrls: ["./section-sales.component.css"],
})
export class SectionSalesComponent implements OnInit {
  public chartData: any[] = [];

  constructor(private fetcherService: SensorDataFetcherService) {}

  ngOnInit() {
    this.getChartData();
  }

  getChartData() {
    this.fetcherService.getData().subscribe(
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
