import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ObservableInput } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-delconc',
  templateUrl: './delconc.component.html',
  styleUrls: ['./delconc.component.css']
})
export class DelconcComponent {
n_gram!: string;
upper!: string;
lower!: string;
act_file!: string;
act_sentnum!: string;
act_db!: string;
broadcon: any;
postdownconc!: any;
fileUrl: any;
deltconc!: any;
respost!: any;
concaparam: any;
STRICT!: string;
ConcNames: any;
ConcName: any;
ConcDowan: any;
DBname: string = 'temporary';
collapsed: boolean = true;
n_length: {"russ":string,"length":string}[] = [
  {"russ":'два слова',"length":'2'},
  {"russ":'три слова',"length":'3'},
  {"russ":'четыре слова',"length":'4'},
]
entry_types: {"russ":string,"eng":string}[] = [
  {'russ':'токен','eng':'token'},{'russ':'лемма','eng':'lemma'}
]
truthcond: {"eng":string,"rus":string}[] = [
  {"eng":"yes","rus":"да"},
  {"eng":"no","rus":"нет"}
];
truth: boolean = true;
login: any;
obs!: ObservableInput<any>;
number: any;
contents!: [];

constructor(private http: HttpClient, private sanitizer: DomSanitizer) { 
this.retrieve_conc_names()
}

handleError(error: HttpErrorResponse) {
  if (error.status == 422) {
    console.log('Ошибка 422!');
    if (this.truth) {this.truth = false};
    return this.obs;
  }
  else {
    return this.obs;
  }
}


poster(address: string, ConcName: string, token: string|null) {
  const tok = token?.replaceAll('"','')
  //const body = {"word": word, "Authorization": "Bearer" + token?.replaceAll('"','')};
  const body = {'ConcName': ConcName};
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});
  console.log(headers);
  console.log(body);
  let r = this.http.post<{}>(address, body, {headers: headers});
  console.log(r);
  return r
  .pipe(catchError(this.handleError));
}  


getridof_it(ConcName: string) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  let p = this.poster('http://127.0.0.1:5000/concordance_deleter', ConcName, token);
  p.subscribe(res => {
    this.deltconc = res;
    console.log(res);
    console.log(this.act_db);
    this.truth = true;
    this.ConcName = null;
    this.retrieve_conc_names();
});
}

post_ready_conc(address: string, DBname: string, concordance: {}, token: string|null) {
  const tok = token?.replaceAll('"','')
  //const body = {"word": word, "Authorization": "Bearer" + token?.replaceAll('"','')};
  const body = {'DBname': DBname, 'concordance': concordance};
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});
  console.log(headers);
  console.log(body);
  let r = this.http.post<{}>(address, body, {headers: headers});
  console.log(r);
  return r
  .pipe(catchError(this.handleError));
} 

save_concordance(DBname: string, concordance: {}) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  let p = this.post_ready_conc('http://127.0.0.1:5000/concordance_saver', DBname, concordance, token);
  p.subscribe(res => {
    this.respost = res;
    console.log(res);
    this.truth = true;
});  
}

post_da_conc(address: string, DBname: string, ConcName: string, concordance: {}, token: string|null) {
  const tok = token?.replaceAll('"','')
  //const body = {"word": word, "Authorization": "Bearer" + token?.replaceAll('"','')};
  const body = {'DBname': DBname, 'ConcName':ConcName, 'concordance': concordance};
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});
  console.log(headers);
  console.log(body);
  let r = this.http.post<{}>(address, body, {headers: headers});
  console.log(r);
  return r
  .pipe(catchError(this.handleError));
} 


retrieve_conc_names() {
  let p = this.http.get<any>('http://127.0.0.1:5000/enumerate_concordances');
  console.log(p);
  p.subscribe(res => {this.ConcNames = res;
    console.log(res)});
}

reactButton(s: any) {
  this.number = s.number;
  this.contents = s.contents;
}

closeButton(s: any) {
  this.contents = [];
}

collapse(s: any) {
  this.collapsed = s.collapsed;
  if (this.collapsed == true) {
    return this.collapsed = false;
  }
  else {
    return this.collapsed = true;
  }
}


check() {
  if (this.truth == true) {
    return true;
  }
  else {
    return false;
  }
}

xgramtrig() {
  this.concaparam = true;
}


checkxgramtrig() {
  if (this.concaparam == false){
    return false;
  }
  else {
    return true;
  }
}

}
