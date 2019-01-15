import { Component, OnInit, OnChanges, Input } from "@angular/core";

@Component({
  selector: "app-battery-level",
  templateUrl: "./battery-level.component.html",
  styleUrls: ["./battery-level.component.css"],
})
export class BatteryLevelComponent implements OnInit, OnChanges {
  @Input() batteryLevelData: any | any[];
  public isHovered: boolean = false;
  public interval: any;
  public intervalDuration: number = 5000;
  public batteryLevel: number = 0;
  public startCounter: number = 0;

  constructor() {}

  ngOnInit() {
    this.setData();
  }

  ngOnChanges() {
    if (typeof this.batteryLevelData !== typeof Array) {
      this.startGraph();
    }
  }

  setData() {
    if (typeof this.batteryLevelData === typeof Array) {
      this.interval = setInterval(() => {
        this.startGraph();
      }, this.intervalDuration);
    }
  }

  startGraph() {
    if (typeof this.batteryLevelData === typeof Array) {
      this.batteryLevel = this.batteryLevelData[
        this.startCounter
      ].BatteryPercentage;
      this.startCounter++;
    } else {
      this.batteryLevel = this.batteryLevelData.BatteryPercentage;
    }

    this.updateBatteryIndicators();
  }

  handleMouseHover() {
    this.isHovered = true;
  }

  handleMouseLeave() {
    this.isHovered = false;
  }

  updateBatteryIndicators() {
    let indicators = document.querySelectorAll(".indicator");

    this.resetIndicatorClasses(indicators);

    if (this.batteryLevel <= 20) {
      indicators.forEach(indicator => {
        let indicatorLevel = parseInt(indicator.getAttribute("level"));

        if (this.batteryLevel >= indicatorLevel) {
          indicator.classList.add("indicator-animated-red");
        }
      });
    } else if (this.batteryLevel <= 60) {
      indicators.forEach(indicator => {
        let indicatorLevel = parseInt(indicator.getAttribute("level"));

        if (this.batteryLevel >= indicatorLevel) {
          indicator.classList.add("indicator-animated-yellow");
        }
      });
    } else if (this.batteryLevel <= 100) {
      indicators.forEach(indicator => {
        let indicatorLevel = parseInt(indicator.getAttribute("level"));

        if (this.batteryLevel >= indicatorLevel) {
          indicator.classList.add("indicator-animated-green");
        }
      });
    }
  }

  resetIndicatorClasses(indicators) {
    indicators.forEach(indicator => {
      indicator.classList.remove(
        "indicator-animated-green",
        "indicator-animated-yellow",
        "indicator-animated-red"
      );
    });
  }
}
