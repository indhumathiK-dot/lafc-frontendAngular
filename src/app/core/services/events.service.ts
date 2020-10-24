import { Injectable, EventEmitter } from '@angular/core';

@Injectable({providedIn:'root'})
export class EventsService {
    constructor(){}
    logoutEvent$:EventEmitter<any> = new EventEmitter();
    loginEvent$:EventEmitter<any> = new EventEmitter();
}