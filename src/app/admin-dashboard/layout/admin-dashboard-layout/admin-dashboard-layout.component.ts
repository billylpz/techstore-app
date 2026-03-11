import { Component, OnInit } from '@angular/core';
import { AdminNavbarComponent } from '../../components/admin-navbar/admin-navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-layout',
  templateUrl: './admin-dashboard-layout.component.html',
  styleUrls: ['./admin-dashboard-layout.component.css'],
  imports: [AdminNavbarComponent, RouterOutlet]
})
export class AdminDashboardLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
