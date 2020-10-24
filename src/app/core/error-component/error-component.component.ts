import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-error-component',
  templateUrl: './error-component.component.html',
  styleUrls: ['./error-component.component.css']
})
export class ErrorComponentComponent implements OnInit {
  public errorMessage: string = "500 SERVER ERROR, CONTACT ADMINISTRATOR!!!!";
  public dialogRef: MatDialogRef<ErrorComponentComponent>
  @Input() isContinue: boolean;
  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit() {
    
  }
  onClickContinue() {
    this.authenticationService.logOutCurrentUser();
    this.dialogRef.close();
  }
  onClickCancel() {
    this.dialogRef.close();
  }
}
