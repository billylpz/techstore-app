import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'],
  imports: [RouterLink]
})
export class AdminNavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
