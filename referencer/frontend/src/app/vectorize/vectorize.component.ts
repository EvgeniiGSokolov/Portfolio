import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-vectorize',
  templateUrl: './vectorize.component.html',
  styleUrls: ['./vectorize.component.css']
})

export class VectorizeComponent {
  dbname!: string;
  vecmodelname!: string;
  vecsize!: string;
  winsize!: string;
  mincount!: string;
  epochs!: string;
  fileName = '';
  filelist!: any;
  posted!: any;
  DBnames: any;
  DBname: any;
  param: boolean = false;
  truthcond: boolean = true;
  alg!: string;
  algorithm: {'russ':string,'eng':string}[] = [
    {'russ':'skip-gram','eng':'1'},
    {'russ':'CBOW','eng':'0'}
  ] 

  constructor(private http: HttpClient) {
    this.retrieveDB()
  }

  trigger() {
    this.param = true;
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

  make_vectorbase() {
    const token = localStorage.getItem('id_token'); 
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});   
    this.truthcond = false;
    const dbmaker$ = this.http.post('http://127.0.0.1:5000/make_vectors', {'directive':'make_db', 'alg': this.alg, 'epochs':this.epochs, 'vecsize':this.vecsize, 'winsize':this.winsize, 'minimum':this.mincount, 'dbname':this.DBname, 'vecmodelname':this.vecmodelname}, {headers: headers});
    dbmaker$.subscribe(res => {this.posted = res;
    console.log(res);
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


