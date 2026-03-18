import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-databaser',
  templateUrl: './databaser.component.html',
  styleUrls: ['./databaser.component.css']
})

export class DatabaserComponent {
  dbname!: string;
  dbinfo!: any;
  depth!: string;
  element!: string;
  adddepth!: string;
  fileName = '';
  filelist!: any;
  posted!: any;
  DBnames: any;
  DBname: any;
  DBaddend: any;
  param: boolean = false;
  paramtwo: boolean = false;
  paramthree: boolean = true;
  truthcond: boolean = true;
  options: {"russ":string,"short":string}[] = [
    {'russ':'нужен','short':'fullscale'},{'russ':'не нужен','short':'shallow'}
  ]

  constructor(private http: HttpClient) {
    this.retrieveDB()
  }

  trigger() {
    this.param = true;
  }

  triggertwo() {
    this.paramtwo = true;
  }

  checkOut() {
    if (
      this.param == true
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  checkOuttwo() {
    if (
      this.paramtwo == true
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  checkOutThree() {
    if (
      this.paramthree == true
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  make_database() {
    const token = localStorage.getItem('id_token'); 
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});   
    this.truthcond = false;
    const dbmaker$ = this.http.post('http://127.0.0.1:5000/database', {'directive':'make_db', 'dbname':this.dbname, 'depth':this.depth}, {headers: headers});
    dbmaker$.subscribe(res => {this.posted = res;
    console.log(res);
  this.truthcond = true;})
  }

  append_database() {
    const token = localStorage.getItem('id_token'); 
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});   
    this.truthcond = false;
    const dbmaker$ = this.http.post('http://127.0.0.1:5000/append_database', {'directive':'make_db', 'dbname':this.DBaddend, 'depth':this.adddepth}, {headers: headers});
    dbmaker$.subscribe(res => {this.posted = res;
    console.log(res);
  this.truthcond = true;})
  }

  drop_database() {
    const token = localStorage.getItem('id_token'); 
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});   
    this.truthcond = false;
    const dbmaker$ = this.http.post('http://127.0.0.1:5000/clear', {'directive':'make_db', 'dbname':this.DBname}, {headers: headers});
    dbmaker$.subscribe(res => {this.posted = res;
    console.log(res);
  this.truthcond = true;})
  }

  see_database() {
    const token = localStorage.getItem('id_token'); 
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});   
    this.truthcond = false;
    this.paramthree = false;
    const dbmaker$ = this.http.post('http://127.0.0.1:5000/dbinfo', {'directive':'make_db', 'dbname':this.DBname}, {headers: headers});
    dbmaker$.subscribe(res => {this.dbinfo = res;
    console.log(res);
  this.paramthree = true;
  this.truthcond = true;})
  }

  retrieveDB() {
    let p = this.http.get<any>('http://127.0.0.1:5000/list_dbs');
    console.log(p);
    p.subscribe(res => {this.DBnames = res;
      console.log(res)});
  }

  check() {
    if (this.truthcond == true) {
      return true;
    }
    else {
      return false;
    }
  }
}


