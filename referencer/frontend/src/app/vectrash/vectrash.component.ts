import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-vectrash',
  templateUrl: './vectrash.component.html',
  styleUrls: ['./vectrash.component.css']
})

export class VectrashComponent {
  dbname!: string;
  word!: string;
  fileName = '';
  filelist!: any;
  posted!: any;
  Modelnames: any;
  Modelname: any;
  param: boolean = false;
  truthcond: boolean = true;
  POS!: string;
  postags: { "short": string, "russ": string }[] = [
    { "short": "all", "russ": "без анализа" },
    { "short": "S", "russ": "существительное" },
    { "short": "V", "russ": "глагол" },
    { "short": "A", "russ": "прилагательное" },
    { "short": "ADV", "russ": "наречие" },
    { "short": "SPRO", "russ": "местоимение-существительное" },
    { "short": "APRO", "russ": "местоимение-прилагательное" },
    { "short": "PR", "russ": "предлог" }
  ];

  constructor(private http: HttpClient) {
    this.getDB()
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

  compare_words() {
    const token = localStorage.getItem('id_token'); 
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});   
    this.truthcond = false;
    const dbmaker$ = this.http.post('http://127.0.0.1:5000/n_closest', {'directive':'compare', 'modelname':this.Modelname, 'word':this.word,'graminfo':this.POS}, {headers: headers});
    dbmaker$.subscribe(res => {this.posted = res;
    console.log(res);
  this.truthcond = true;})
  }

  getDB() {
    let p = this.http.get<any>('http://127.0.0.1:5000/choose_vecmodel');
    console.log(p);
    p.subscribe(res => {this.Modelnames = res;
      console.log(res)});
  }

  delete_vecmodel() {
    const token = localStorage.getItem('id_token'); 
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});   
    this.truthcond = false;
    const dbmaker$ = this.http.post('http://127.0.0.1:5000/vecdelete', {'modelname':this.Modelname}, {headers: headers});
    dbmaker$.subscribe(res => {this.posted = res;
    console.log(res);
  this.truthcond = true;})
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


