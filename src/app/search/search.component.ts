import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  hostName = "http://localhost:3080/";


  closeResult = '';

  keyword = "";
  distance : any;
  category = "all";
  location = "";
  autoDetect = false;
  latAndLon = {lat : '0', lon : '0'};
  businesses_array : any;
  businesses_dist : any;
  display_table = false;
  display_detail = false;
  has_result = true;

  business_detail = {id: '', name : 'Izakaya Osen', address : '2903 Sunset Blvd', cat : 'Sushi Bars | Izakaya | Seafood', 
  phone : '(323) 928-2220', price : '$', status : 'Open', url : 'url'};

  business_imgs_array : any;

  business_review : any;

  email = "";
  date = "";
  time1 = "";
  time2 = "";

  options : any;

  twitter_share_link:any;
  facebook_share_link:any;


  email_valid = true;
  date_valid = true;
  time_valid = true;

  mapOptions : google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom: 14
  };

  marker = {position: {lat: 38, lng: -77}};

  constructor(private http: HttpClient) { 
    this.getGeoLocation();
  }

  ngOnInit(): void {
      console.log("asdasnjdhasjkdhaskdahsdjsa");
      //reference https://getbootstrap.com/docs/5.0/forms/validation/
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.querySelectorAll('.needs-validation');
      console.log('modal form', forms);
      // Loop over them and prevent submission
      Array.prototype.slice.call(forms).forEach(function (form) {
          form.addEventListener('submit', function (event : any) {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
            }
  
            form.classList.add('was-validated');
          }, false)
      })
  }

  getGeoLocation() {
    this.http.get<{loc: string}>("https://ipinfo.io/?token=311443a0910a19")
      .subscribe((res) => {
        console.log("getGeoLocation");
        console.log(res.loc);
        var ladLon = res.loc.split(",");
        this.latAndLon['lat'] = ladLon[0];
        this.latAndLon['lon'] = ladLon[1];
        console.log(this.latAndLon);
      });
  }

  clearAll(){
    this.keyword = "";
    this.distance = 10;
    this.category = "all";
    this.location = "";
    this.autoDetect = false;
    this.display_table = false;
    this.display_detail = false;
  }

  clearDetailAndTable(){
    
  }

  submitForm() {
    console.log("submit");
    console.log(this.keyword, this.distance, this.category, this.location, this.autoDetect);

    this.sendRequest();
  }

  sendRequest() {
    let param = new HttpParams();
    param = param.append("term", this.keyword);
    param = param.append("latitude", this.latAndLon['lat']);
    param = param.append("longitude", this.latAndLon['lon']);
    param = param.append("categories", this.category);
    param = param.append("radius", this.distance);
    param = param.append("location", this.location);
    param = param.append("checkbox", this.autoDetect);

    this.http.get(this.hostName + "query", {params: param})
    .subscribe((res) => {
      console.log("send req to backend");
      console.log(res);
      this.businesses_dist = res;
      this.displayTable();
    });
  }

  displayTable(){
    this.display_table = true;
    this.businesses_array = [];
    let business = this.businesses_dist['businesses'];
    let len = Math.min(business.length, 10);

    if(len == 0) {
      this.has_result = false;
      return;
    } else {
      this.has_result = true;
    }

    for(let i = 0; i < len; i++) {
      // businesses_array = [{id:0, image:'img', name:'name', rating:'rating', dis:'dis'}];
      let id = business[i]["id"];
      let img = business[i]["image_url"];
      let name = business[i]["name"];
      let rat = business[i]["rating"];
      let dis = business[i]["distance"];
      dis = (dis / 1609.34).toFixed(2);

      let temp = {number : i + 1, image : img, name : name,rating : rat, dis : dis, id : id};
      this.businesses_array.push(temp);
    }

  }

  clickName(id : any) {
    console.log("Click on name, id=" + id);
    this.displayDetail(id);
  }

  displayDetail(id : any) {
    console.log(this.businesses_array[id]);
    console.log(this.businesses_dist);
    this.requestDetail(id);
  }

  requestDetail(id : any) {
    let param = {id : id};
    this.http.get(this.hostName + "detail", {params: param})
    .subscribe((res : any) => {
      console.log("detail get!");
      console.log(res);
      let name = res.name;

      let address = '';
      for(let i = 0; i < res.location.display_address.length; i++) {
        address = address + ' ' + res.location.display_address[i];
      }
      
      let cat = ' ';
      for(let i = 0; i < res.categories.length; i++) {
        cat = cat + res.categories[i].title;
        if(i != res.categories.length - 1) {
          cat = cat + ' | ';
        }
      }

      let phone = res.display_phone;

      let price = res.price;

      let status;
      if(res.hours == null || !res.hours[0].is_open_now){
        status = 'Closed';
      } else {
        status = 'Open Now';
      }

      let url = res.url;

      let imgs = res.photos;
      this.business_imgs_array = res.photos;

      this.business_detail = {id : id, name : name, address : address, cat : cat, 
                              phone : phone, price : price, status : status, url : url};
      this.requestReview(id);

      this.display_table = false;
      this.display_detail = true;
      this.twitter_share_link = "https://twitter.com/intent/tweet?text=" + "Check%20" + name + "%20on%20Yelp." + "%20&url=" + url;
      this.facebook_share_link = "https://www.facebook.com/sharer/sharer.php?u=" + url + "&quote=yelp";
      
      let blat = res.coordinates.latitude;
      let blon = res.coordinates.longitude;
      this.mapOptions = {
        center : {lat: blat, lng: blon}, 
        zoom : 14
      };
      this.marker = {position: {lat: blat, lng: blon}};
      // document.getElementById("result-detail")?.scrollIntoView({
      //   behavior: "smooth",
      //   block: "start",
      //   inline: "nearest"
      // });
    });
  }

  requestReview(id : any) {
    let param = {id : id};
    this.business_review = [];
    this.http.get(this.hostName + "review", {params: param})
    .subscribe((res : any) => {
      console.log("Receive reviews:" , res);
      console.log(res.reviews);
      for(let i = 0; i < res.reviews.length; i++) {
        let name = res.reviews[i].user.name;
        let comment = res.reviews[i].text;
        let rating = res.reviews[i].rating;
        let date = res.reviews[i].time_created;
        this.business_review.push({name : name, comment : comment, rating : rating, date : date})
      }
    });
  }


  submitReservationForm(){
    console.log('submit reservation form');
    console.log(this.email, this.date, this.time1, this.time2);

    if(this.email == ""|| this.date == "" || this.time1 == ""|| this.time2 == "") {
      console.log('validation failed');
      return;
    }

    let len = localStorage.length;
    let tmp = {'id': this.business_detail.id, 'bname': this.business_detail.name, 'date' : this.date, 'time': this.time1 + ':' + this.time2, 'email': this.email};
    localStorage.setItem(this.business_detail.id, JSON.stringify(tmp));
    console.log(localStorage);
    alert("Reservation created!");
  }

  returnBack() {
    this.display_table = true;
    this.display_detail = false;
  }

  requestAutoComplete(event : Event){
    let inputValue = (<HTMLInputElement>event.target).value;
    this.options = [];
    console.log('user input', inputValue);

    let param = {inputValue : inputValue};
    this.http.get(this.hostName + "autocomplete", {params: param})
    .subscribe((res: any) => {
      for(let i = 0; i < res.categories.length; i++) {
        let tmp = res.categories[i].title;
        this.options.push(tmp);
      }
      for(let i = 0; i < res.terms.length; i++) {
        let tmp = res.terms[i].text;
        this.options.push(tmp);
      }
    });
  }

  getColor(){
    return this.business_detail.status == 'Open Now' ? 'green' : 'red';
  }

  // initModalForm(){
  //   console.log("asdasnjdhasjkdhaskdahsdjsa");
  //   //reference https://getbootstrap.com/docs/5.0/forms/validation/
  //     // Fetch all the forms we want to apply custom Bootstrap validation styles to
  //     var forms = document.querySelectorAll('.needs-validation');
  //     console.log('modal form', forms);
  //     // Loop over them and prevent submission
  //     Array.prototype.slice.call(forms).forEach(function (form) {
  //         form.addEventListener('submit', function (event : any) {
  //           if (!form.checkValidity()) {
  //             event.preventDefault();
  //             event.stopPropagation();
  //           }
  
  //           form.classList.add('was-validated');
  //         }, false)
  //     })
  // }

  hasReserved(id : any) {
    if(localStorage.getItem(id) != null) {
      return true;
    } else {
      return false;
    }
  }

  cancelReservation(id : any){
    localStorage.removeItem(id);
  }

}




