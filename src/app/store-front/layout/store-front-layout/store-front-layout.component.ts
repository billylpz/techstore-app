import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-store-front-layout',
  templateUrl: './store-front-layout.component.html',
  styleUrls: ['./store-front-layout.component.css'],
  imports: [NavbarComponent, FooterComponent, RouterOutlet]
})
export class StoreFrontLayoutComponent  {

  
}
