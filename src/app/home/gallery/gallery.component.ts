import { Component, OnInit } from '@angular/core';
import { GalleryService } from './gallery.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  images = [];
  selectedImageObject;
  constructor(private galleryService: GalleryService,
    public router: Router) { }

  ngOnInit() {
    this.loadGalleryImages();
  }
  loadGalleryImages() {
    this.galleryService.getGalleryImages().subscribe(data => {
      if (data.success === 1) {
        this.images = data.data;
      }
    });
  }
  openModal(imageObject) {
    this.selectedImageObject = imageObject;
  }
  gotoHome() {
    this.router.navigate(['/']);
  }
}
