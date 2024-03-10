import { Component, OnInit } from "@angular/core";
import { CurrentUserService } from "app/services/current-user.service";
import { Router } from "@angular/router";

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: "/profile/user", title: "My Profile", icon: "nc-single-02", class: "" },
  { path: "/profile/birth-chart", title: "Provider Admin", icon: "nc-chart-bar-32", class: "" },
  { path: "/profile/tables", title: "History", icon: "nc-chat-33", class: "" },
  { path: "/profile/credits", title: "Billing", icon: "nc-shop", class: "" },
];

@Component({
  moduleId: module.id,
  selector: "sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public menuItems: any[] = [];
  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router
  ){}

    signOut(): void {
      this.currentUserService.clearJwt();
      this.router.navigate(['/login']);
      return;
    }
}
