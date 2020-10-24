import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  latitude: number;
  longitude: number;
  zoom: number;
  constructor() { }

  ngOnInit() {
    this.latitude = 13.087420;
    this.longitude = 80.280487;
    this.zoom = 15;
  }

}
