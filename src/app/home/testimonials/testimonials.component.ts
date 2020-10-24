import { Component, OnInit } from '@angular/core';
import { TestimonialsService } from 'src/app/core/services/testimonials.service';
import { DomSanitizer } from '@angular/platform-browser';
import decode from 'decode-html';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  testimonials = [];
  constructor(private testimonialsService: TestimonialsService, 
    public sanitizer: DomSanitizer,
    public router: Router) { }

  ngOnInit() {
    this.loadTestimonials();
  }
  decodeTestimonials(input) {
    return decode(input);
  }
  loadTestimonials() {
    this.testimonialsService.getTestimonials().subscribe(data => {
      if (data.success === 1) {
        this.testimonials = data.data;
      }
    });
  }
  gotoHome() {
    this.router.navigate(["/"]);
  }
}
