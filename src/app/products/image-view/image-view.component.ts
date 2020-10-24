import { Component, OnInit } from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit {
  public image: any;
  public imageArray = [];
  public slideIndex;
  public hideLeft: boolean;
  public hideRight: boolean

  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit() {
    setTimeout(() => {
    this.slideIndex = this.bsModalRef.content.currentImage ;
    this.imageArray = this.bsModalRef.content.imagesArray;
    console.log(this.imageArray)
      setTimeout(() => {
        // this.slideIndex = this.imageArray.length - this.bsModalRef.content.currentImage
      this.showDivs(this.slideIndex);
      }, 200);
    }, 200);
  }

  hideModal() {
    this.bsModalRef.hide();
  }

  plusDivs(n) {
    this.showDivs(this.slideIndex += n);
  }

  showDivs(n) {
    this.hideRight = n + 1 === this.imageArray.length;
    this.hideLeft = n === 0
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
      x[i]['style'].display = "none";
    }
    x[this.slideIndex]['style'].display = "block";
  }

}
