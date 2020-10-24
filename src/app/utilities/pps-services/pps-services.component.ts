import { Observable } from 'rxjs';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { BestSellerHttpService } from './../../core/services/http/bestsellerhttpservice';

@Component({
  selector: 'app-pps-services',
  templateUrl: './pps-services.component.html',
  styleUrls: ['./pps-services.component.css']
})
export class PpsServicesComponent implements OnInit {

  public image: any ;
  state$: Observable<object>;
  public information = [];
  public info: any;
  public title: string;
  public link: any;
  public ImageByOb: string;

  constructor(public route: ActivatedRoute, public bestSellerHttpService: BestSellerHttpService, public ngZone: NgZone) { }  
  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      // this.title = params.get('title');
      this.link = params.get('link');
      this.getInformation();
      this.getInformationByID(this.link);
    });
  }

  getInformation() {
    this.bestSellerHttpService.getBannerAPI().subscribe(res => {
      if (res.success === 1) {
        this.information = res.data;
        if (this.link == 8) {
          this.title = this.information[0].title;
          this.image = this.information[0].image;
        } else if (this.link == 9) {
          this.title = this.information[1].title;
          this.image = this.information[1].image;
        } else if (this.link == 7) {
          this.title = this.information[2].title;
          this.image = this.information[2].image;
        } else if (this.link == 16) {
          this.title = this.information[3].title;
          this.image = this.information[3].image;
        } else if (this.link == 17) {
          this.title = this.information[4].title;
          this.image = this.information[4].image;
        } else {
          this.title = this.information[0].title;
          this.image = this.information[0].image; 
        }
      }
    });
  }

  getInformationByID(id) {
      this.bestSellerHttpService.getInformationByIDAPI(id).subscribe( res => {
        this.info = res.data;
        });
  }
}
