import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'reference_finder';
  login!: string;
  password!: string;
  login_param: boolean = false;
  password_param: boolean = false;
  log_button: boolean = true;
  exit_button: boolean = false;
  userData: any;

  constructor (private http: HttpClient) {}

  log_trigger() {
    this.login_param = true;
  }

  pass_trigger() {
    this.password_param = true;
  }  

  send_userdata(login: string, password: string) {
    const body = {"nomen":login, "tessera":password};
    console.log(body);
    let r = this.http.post<{}>('http://127.0.0.1:5000/log_in', body);
    r.subscribe(res => {this.userData = res;
      console.log(this.userData.access_token);});
      localStorage.setItem('id_token',JSON.stringify(this.userData.access_token));
      localStorage.setItem('login',this.userData.login);
      localStorage.setItem('status',this.userData.status);
      this.log_button = false;
      this.exit_button = true;
  }

  log_out() {
    const body = {"nomen":'logout',"tessera":'logout'};
    let r = this.http.post<{}>('http://127.0.0.1:5000/log_out', body);
    r.subscribe(res => {this.userData = res;
      console.log(this.userData.access_token);});
      localStorage.setItem('id_token','none');
      localStorage.setItem('login','none');
      localStorage.setItem('status',this.userData.status);
      this.exit_button = false;
      this.log_button = true;
  }
}
