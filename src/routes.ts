import { Routes } from "@angular/router";
import { SectionSalesComponent } from "./app/sections/section-sales/section-sales.component";

export const appRoutes: Routes = [
  { path: "sales", component: SectionSalesComponent },
  { path: "", redirectTo: "/sales", pathMatch: "full" },
];
