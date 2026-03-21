import { Component, OnInit } from '@angular/core';
import { AdminNavbarComponent } from '../../components/admin-navbar/admin-navbar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-admin-dashboard-layout',
  templateUrl: './admin-dashboard-layout.component.html',
  styleUrls: ['./admin-dashboard-layout.component.css'],
  imports: [AdminNavbarComponent, RouterOutlet, FooterComponent]
})
export class AdminDashboardLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
