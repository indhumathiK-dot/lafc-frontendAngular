import { Component, OnInit, Input, NgZone, ViewChild } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { BestSellerHttpService } from 'src/app/core/services/http/bestsellerhttpservice';
import { DomSanitizer } from '@angular/platform-browser';
import { MyOrdersService } from 'src/app/services/my-orders.service';
import { CategoryService } from 'src/app/services/category.service';
import decode from 'decode-html';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
var $: any;
@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit {
  toggle: boolean = false;
  alternate = false;
  opts = {
    alternate:true,
    toggle:true
  }
  size: number = 40;
  expandEnabled: boolean = true;
  side = 'right';
  color: boolean = false;
  max = 5;
  rate = 0;
  isReadonly = false;
  feebackTxt: string;
  currentUser: any;
  feedbackObj = {
    name: 'string',
    text: 'string',
    rating: 'string'
  };
  isOpened: boolean = false;
  selectedReasonId;
  returnRedirectUrl: any;
  isReturn = false;

  reasonsList = [
    {
      "title": "Dead on Arrival",
      "id": "1"
    },
    {
      "title": "Received wrong item",
      "id": "2"
    },
    {
      "title": "Other",
      'id': '3'
    }
  ];

  @Input() product: any;
  @Input() histories: any;
  @Input() orderInfo: any;
  @ViewChild('timeline',{static:false})timeline
  hideModal: boolean = false;
  isFeedbackSent;
  feedbackData: any;

  latestStatus;
  latestStatusDate;
  trackModalRef: BsModalRef;
  feedbackModalRef: BsModalRef;
  returnModalRef: BsModalRef;

  constructor(public productsService: ProductsService,
    public sanitizer: DomSanitizer,
    public catService: CategoryService,
    public myOrdersService: MyOrdersService,
    private router: Router,
    public modalService: BsModalService,
    public bestSellerHttpService: BestSellerHttpService) { }

  ngOnInit() {
    this.feedbackObj.rating = "0";
    this.currentUser = this.bestSellerHttpService.getCurrentUser();
    this.loadLatestStatus();
    // document.getElementById('modal-dialog').style.width = "1000px";
  }
  track(){
    setTimeout(()=>{
      $(document).ready(function(){
        $('html').css('zoom','80%'); /* Webkit browsers */
        $('html').css('zoom','0.8'); /* Other non-webkit browsers */
        $('html').css('-moz-transform','scale(0.8, 0.8)'); /* Moz-browsers */
      });
      $(document).ready(function(){
        $('html').css('zoom','100%'); /* Webkit browsers */
        $('html').css('zoom','1.0'); /* Other non-webkit browsers */
        $('html').css('-moz-transform','scale(1.0, 1.0)'); /* Moz-browsers */
      });
    },100)
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
  loadLatestStatus() {
    this.latestStatusDate = new Date(Math.max.apply(null, this.histories.map(function (e) {
      return new Date(e.date_added);
    })));
    this.latestStatus = this.histories.find(a => {
      const date = new Date(a.date_added);
      const getDate = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
      const latest = this.latestStatusDate;
      const latestDate = latest.getDate() + '/' + latest.getMonth() + '/' + latest.getFullYear();
      if (getDate === latestDate) {
        return a.status;
      }
    });
  }
  onExpandHistory(expanded, index) {

  }
  onDotClick() {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }
  confirmSelection(event: KeyboardEvent) {
    if (event.keyCode === 13 || event.key === 'Enter') {
      this.isReadonly = true;
    }
  }
  openFeedbackModal(template) {
    this.feedbackModalRef = this.modalService.show(template);
  }
  onSubmitReview(prodId) {
    let newReviewItem = {
      "name": this.currentUser.firstname + this.currentUser.lastname,
      "text": this.feebackTxt,
      "rating": this.feedbackObj.rating.toString()
    };
    this.productsService.addProductReview(prodId, newReviewItem).subscribe(
      e => {
        this.feedbackData = e;
      });
      this.isFeedbackSent = !this.isFeedbackSent;
      this.feedbackModalRef.hide();
  }
 
  openReturnModal(template) {
    this.returnModalRef = this.modalService.show(template);
  }
  onSubmitReason(formValue) {
    this.currentUser = this.bestSellerHttpService.getCurrentUser();
    let returnItem = {
      "firstname": this.currentUser.firstname,
      "lastname": this.currentUser.lastname,
      "email": this.currentUser.email,
      "telephone": this.currentUser.telephone,
      "date_ordered": this.myOrdersService.orderDetails.date_added,
      "order_id": this.myOrdersService.orderDetails.order_id,
      "product": this.product.name,
      "model": this.product.model,
      "return_reason_id": this.selectedReasonId,
      "opened": this.isOpened,
      "quantity": this.product.quantity,
      "comment": "string"
    };
    this.productsService.returnProduct(returnItem).subscribe(
      data => {
        if (data.success === 1) {
          this.isReturn = true;
        }
      }
    );
    this.returnModalRef.hide();

  }

  onReorderClicked(ordId, prod_ordId) {
    this.myOrdersService.reorderProductById(ordId, prod_ordId);
  }
  decodeContent(input) {
    return decode(input);
  }
  openTrackModal(template) {
    this.trackModalRef = this.modalService.show(template);
  }
  loadProduct(name, id) {
    this.router.navigate(this.getLink(name, id));
    this.trackModalRef.hide();
  }
}
