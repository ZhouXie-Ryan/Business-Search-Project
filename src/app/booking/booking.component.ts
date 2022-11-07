import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  booking_array : any;
  is_empty = true;

  constructor() { 
    this.booking_array = [];
    let len = localStorage.length;
    if(len == 0) {
      this.is_empty = true;
    } else {
      this.is_empty = false;
      for(let i = 0; i < len; i++) {
        let key = localStorage.key(i);
        let item = JSON.parse(localStorage.getItem(String(key))!);
        console.log(item);
        this.booking_array.push(item);
      }
    }
  }

  ngOnInit(): void {
  }

  onDelete(id : any, num : any) {
    console.log(id);
    localStorage.removeItem(id);
    alert('Reservation cancelled!');
    this.booking_array.splice(num, 1);
    if(localStorage.length == 0) {
      this.is_empty = true;
    }
  }


}
