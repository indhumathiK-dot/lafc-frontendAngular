import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {debounceTime, switchMap, take} from "rxjs/operators";
import {ProductsService} from "../../services/products.service";

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchListComponent implements OnInit {
  searchForm: FormGroup;
  public limit = 24;
  private pageSize: any;
  public products = [];
  public searchCheck: boolean = false;
  public searchWord = '';

  constructor(private fb: FormBuilder,
              private productsService: ProductsService) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  onChange(event) {
    this.onSubmit(event.pageSize, (event.pageIndex + 1));
  }

  onSubmit(limit, page) {
    if(this.searchForm.value.search !== '') {
      this.searchCheck = true;
      this.searchWord = this.searchForm.value.search;
      this.productsService.searchBundleProduct(this.searchForm.value.search, limit, page).pipe(take(1))
        .subscribe((products) => {
          this.products = products.data;
        });
    } else {
      this.searchCheck = false;
      this.products = [];
    }
  }

  enterSearch(event) {
      if (event.keyCode === 13) {
        this.onSubmit('24', '1');
      }
  }
}
