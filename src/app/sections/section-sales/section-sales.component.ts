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
  public intervalDuration: number = 1250;
  public showCharts: boolean = false;
  public readCOM: boolean = false;
  public COMPort: number = 1;

  constructor(private fetcherService: SensorDataFetcherService) {}

  ngOnInit() {}

  beginCOMRead() {
    this.readCOM = !this.readCOM;
  }

  validateEntry(e) {
    const value: any = e.target.value;

    if (isNaN(value)) {
      e.preventDefault();
    }
  }

  getCOMData() {
    this.fetchingData = true;
    console.log(this.COMPort);

    this.interval = setInterval(() => {
      this.initiateCOMFetch();
    }, this.intervalDuration);
  }

  initiateCOMFetch() {
    this.fetcherService.getComPortData(this.COMPort).subscribe(
      data => {
        this.chartData = JSON.parse(data.toString());
        setTimeout(() => {
          this.fetchingData = false;
          this.showCharts = true;
        }, this.intervalDuration);
      },
      err => console.error(err),
      () => {}
    );
  }
}
