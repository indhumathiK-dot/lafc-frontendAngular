import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from "@angular/router";


export interface DialogData {
  animal: string;
  name: string;
  orderID: number;
}

@Component({
  selector: 'app-dialog-overview',
  templateUrl: './dialog-overview.component.html',
  styleUrls: ['./dialog-overview.component.css']
})
export class DialogOverviewComponent implements OnInit {

  public setClosePopup: any = false;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewComponent>,
    public router: Router,
    public route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {

  }

  onNoClick(): void {
    sessionStorage.setItem('setClosePopup', this.setClosePopup)
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.router.navigate(["/orders" + `/${this.data.orderID}`]);
    sessionStorage.setItem('setClosePopup', this.setClosePopup)
    this.dialogRef.close();
  }

}
