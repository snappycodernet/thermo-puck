import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-battery-level",
  templateUrl: "./battery-level.component.html",
  styleUrls: ["./battery-level.component.css"],
})
export class BatteryLevelComponent implements OnInit {
  public isHovered: boolean = false;

  constructor() {}

  ngOnInit() {}

  handleMouseHover() {
    this.isHovered = true;
    console.log("hovered!");
  }

  handleMouseLeave() {
    this.isHovered = false;
  }
}
