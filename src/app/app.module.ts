import { SensorDataFetcherService } from "./sensor-data-fetcher.service";
import { appRoutes } from "./../routes";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Router } from "@angular/router";
import { NgModule } from "@angular/core";
import { ChartsModule } from "ng2-charts";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { SectionSalesComponent } from "./sections/section-sales/section-sales.component";
import { SectionOrdersComponent } from "./sections/section-orders/section-orders.component";
import { SectionHealthComponent } from "./sections/section-health/section-health.component";
import { BarChartComponent } from "./charts/bar-chart/bar-chart.component";
import { LineChartComponent } from "./charts/line-chart/line-chart.component";
import { PieChartComponent } from "./charts/pie-chart/pie-chart.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    SectionSalesComponent,
    SectionOrdersComponent,
    SectionHealthComponent,
    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ChartsModule,
    HttpClientModule,
  ],
  providers: [SensorDataFetcherService],
  bootstrap: [AppComponent],
})
export class AppModule {}
