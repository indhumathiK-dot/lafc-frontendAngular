import { filter } from 'rxjs/operators';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BestSellerHttpService } from '../../core/services/http/bestsellerhttpservice';
import { BehaviorSubject } from "rxjs";
import * as Rx from "rxjs";
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-banner-mainpage',
  templateUrl: './banner-mainpage.component.html',
  styleUrls: ['./banner-mainpage.component.css']
})
export class BannerMainpageComponent implements OnInit {

  constructor(public bestSellerHttpService: BestSellerHttpService, 
    public route: Router, 
    public catService: CategoryService) { }

  infoData = [];
  infoDataImage = [];
  // const shareImage = new BehaviorSubject(null);

  ngOnInit() {
    this.getInfoData();
  }

  getInfoData(){
      this.bestSellerHttpService.getBannerAPI().subscribe( res => {
      this.infoData = res.data;
      this.infoDataImage = res.data.image;
    });
    return this.infoData;
  }

  getImage(value){
    let image = value.image;
    // this.dataservice.setContentData = image;
    // this.userservice.gettingImage(image);
    this.route.navigate(['/', 'services', value.link, this.catService.slug(value.title)]);
  }

  // shareImage.subscribe((data) => {

  // })

}
