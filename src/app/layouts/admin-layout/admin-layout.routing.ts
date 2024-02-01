import { Routes } from "@angular/router";

import { UserComponent } from "../../pages/user/user.component";
import { TableComponent } from "../../pages/table/table.component";
import { UpgradeComponent } from "../../pages/upgrade/upgrade.component";
import { BirthChartComponent } from "../../pages/birth-chart/birth-chart.component";

export const AdminLayoutRoutes: Routes = [
  { path: "user", component: UserComponent },
  { path: "birth-chart", component: BirthChartComponent },
  { path: "tables", component: TableComponent },
  { path: "icons", component: UserComponent },
  { path: "notifications", component: UserComponent },
  { path: "credits", component: UpgradeComponent },
];
