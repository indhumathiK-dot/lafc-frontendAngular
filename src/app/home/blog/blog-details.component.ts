import { Component, OnInit } from '@angular/core';
import { BlogService } from './blog.service';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import decode from 'decode-html';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {
  blogData;
  recentPostsList = [];
  constructor(public blogService: BlogService, public route: ActivatedRoute, public catService: CategoryService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(e => {
      const id = e.get('ArticleId');
      this.loadBlogByArticleId(id);
      window.scrollTo(0, 0)
    });
    this.loadRecentPosts();
  }
  decodeContent(input) {
    return decode(input);
  }
  loadBlogByArticleId(id) {
    this.blogService.getBlogByArticleId(id).subscribe(data => {
      if (data.success === 1) {
        const list = data.data[0];
        this.blogData = list[0];
      }
    });
  }
  loadRecentPosts() {
    this.blogService.getRecentArticle().subscribe(data => {
      if (data.success === 1) {
        this.recentPostsList = data.data.rows;
      }
    });
  }

}
