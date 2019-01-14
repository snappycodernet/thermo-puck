import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-battery-level",
  templateUrl: "./battery-level.component.html",
  styleUrls: ["./battery-level.component.css"],
})
export class BatteryLevelComponent implements OnInit {
  @Input() batteryLevelData: any[];
  public isHovered: boolean = false;
  public interval: any;
  public intervalDuration: number = 5000;
  public batteryLevel: number = 0;
  public startCounter: number = 0;

  constructor() {}

  ngOnInit() {
    this.setData();
  }

  setData() {
    this.interval = setInterval(() => {
      this.startGraph();
    }, this.intervalDuration);
  }

  startGraph() {
    this.batteryLevel = this.batteryLevelData[
      this.startCounter
    ].BatteryPercentage;

    this.updateBatteryIndicators();

    this.startCounter++;
  }

  handleMouseHover() {
    this.isHovered = true;
  }

  handleMouseLeave() {
    this.isHovered = false;
  }

  updateBatteryIndicators() {
    const indicators = document.querySelectorAll(".battery-bar");

    for (let i = 0; i < indicators.length; i++) {
      if (
        this.batteryLevel >= parseInt(indicators[i].getAttribute("data-power"))
      ) {
        indicators[i].classList.add("battery-bar-filled");
      } else {
        indicators[i].classList.remove("battery-bar-filled");
      }
    }
  }
}
