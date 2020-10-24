import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {CategoryService} from "./services/category.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  isScrolled = false;
  topPositionToStartShowing = 100;

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPositionToStartShowing) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }
  constructor(public router: Router,
              private categoryService: CategoryService) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
    });
    this.scrollTop(event);
    this.getImageDimesion();

  }
  scrollTop(event) {
    window.scroll(0,0);
  }

  getImageDimesion() {
    this.categoryService.getSystemSettingDimension().subscribe(res => {
      localStorage.setItem('image-dimension', JSON.stringify(res));
    })
  }
}
