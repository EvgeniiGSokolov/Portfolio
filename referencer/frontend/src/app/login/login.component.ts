import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  fullname!: string;
  login!: string;
  password!: string;
  full_param: boolean = false;
  login_param: boolean = false;
  password_param: boolean = false;
  userData: any;

  constructor(private http: HttpClient) {}

  full_trigger() {
    this.full_param = true;}

  log_trigger() {
    this.login_param = true;
  }

  pass_trigger() {
    this.password_param = true;
  }  

  send_userdata(fullname: string, login: string, password: string) {
    const token = localStorage.getItem('id_token'); 
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});  
    const body = {"russian":fullname, "nomen":login, "tessera":password};
    console.log(body);
    let r = this.http.post<{}>('http://127.0.0.1:5000/register', body, {headers: headers});
    r.subscribe(res => {this.userData = res;
      console.log(this.userData);});
  }
}
