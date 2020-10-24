import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-my-orders-item',
  templateUrl: './my-orders-item.component.html',
  styleUrls: ['./my-orders-item.component.css']
})
export class MyOrdersItemComponent implements OnInit {
  @Input() product: any;
  constructor(public catService: CategoryService) { }

  ngOnInit() {
  }
  getLink(name, productId) {
    if ((this.product.category !== null) && (this.product.category !== undefined)) {
      let linkArray = this.product.category.map(a => `${a.id}/${this.catService.slug(a.name)}`);
      let a = linkArray.toString();
      let b = a.replace(",", "");
      let c = decodeURI(decodeURI(decodeURI(b)));
      return ['/products', b, this.catService.slug(name), productId];
    } else {
      return ['/products', this.catService.slug(name), productId];
    }
  }

}
