import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile.service';
import decode from 'decode-html';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications;
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.profileService.getNotifications().subscribe(res => {
      if (res.success === 1) {
        this.notifications = res.data;
      }
    });
  }
  decodeContent(input) {
    return decode(input);
  }

}
