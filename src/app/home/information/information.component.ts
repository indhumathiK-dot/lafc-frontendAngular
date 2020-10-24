import { Component, OnInit } from '@angular/core';
import { informationServices } from './information.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  infoDetails: any;
  constructor(private infoService: informationServices, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(e => {
      const id = e.get('id');
      this.loadInfoById(id);
    });
  }
  loadInfoById(id) {
    this.infoService.getInfoById(id).subscribe(data => {
      this.infoDetails = data.data;
    });
  }

}
