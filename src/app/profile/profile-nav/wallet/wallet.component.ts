import { BestSellerHttpService } from './../../../core/services/http/bestsellerhttpservice';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  public isUser = localStorage.getItem('loggedIn');
  public walletDetails: any;
  public walletTotal: any;
  constructor(public bestSellerHttpService: BestSellerHttpService) { }

  ngOnInit() {
    this.getWallet();
  }

  getWallet() {
    if (this.isUser) {
      this.bestSellerHttpService.getWalletDetails().subscribe(res => {
        if (res.success === 1) {
          this.walletDetails = res.data;
          this.walletTotal = res.data.walletTotal;
        }
      });
    }
  }


}
