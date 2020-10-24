import { Component, OnInit } from '@angular/core';
import { BlogService } from './blog.service';
import { CategoryService } from 'src/app/services/category.service';
import decode from 'decode-html';
import { Router } from '@angular/router';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blogsList = [];
  constructor(public blogService: BlogService, 
    public catService: CategoryService,
    public router: Router) { }

  ngOnInit() {
    this.loadAllBlogs();
  }
  decodeContent(input) {
    return decode(input);
  }
  loadAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      if (data.success === 1) {
        this.blogsList = data.data[0];
      }
    });
  }
  gotoHome() {
    this.router.navigate(['/']);
  }
}
