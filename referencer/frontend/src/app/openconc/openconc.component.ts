import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ObservableInput } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-openconc',
  templateUrl: './openconc.component.html',
  styleUrls: ['./openconc.component.css']
})
export class OpenconcComponent {
n_gram!: string;
upper!: string;
lower!: string;
act_file!: string;
act_sentnum!: string;
act_db!: string;
broadcon: any;
postdownconc!: any;
fileUrl: any;
resconc!: any;
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


concord_it(ConcName: string) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  let p = this.poster('http://127.0.0.1:5000/concordance_opener', ConcName, token);
  p.subscribe(res => {
    this.resconc = res;
    this.act_db = this.resconc.result.database;
    console.log(res);
    console.log(this.act_db);
    this.truth = true;
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

closeBroader() {
  this.act_file = '';
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

prep_concordance(DBname: string, ConcName: string, concordance: {}) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  let p = this.post_da_conc('http://127.0.0.1:5000/download_concordance', DBname, ConcName, concordance, token);
  p.subscribe(res => {
    this.postdownconc = res;
    console.log(res);
    this.truth = true;
});  
}

down_concordance() {
  //Надо сообразить. Не работает!
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  const data = this.postdownconc.for_download;
  const binary = atob(data);
  //console.log(binary)
  const byteNumbers = new Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
  byteNumbers[i] = binary.charCodeAt(i);
  };
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type:'application/octet-stream'});
  //const blob = new Blob(['Дикий лосось'],{type:'application/octet-stream'})
  // const blob = new Blob([data], {type:'application/octet-stream'});
  //this.fileUrl = window.URL.createObjectURL(blob);
  this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  //this.fileUrl = window.URL.createObjectURL(data)
  this.truth = true;
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

broader_context(DBname: string,filename: string, sentence: string) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  const tok = token?.replaceAll('"','');
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});  
  this.act_file = filename;
  this.act_sentnum = sentence;
  console.log(sentence)
  const q = this.http.post('http://127.0.0.1:5000/broader_context',{DBname: DBname, filename: filename, sentence: sentence})
  q.subscribe(res => {
    this.broadcon = res;
    console.log(res);
    this.truth = true;
  })
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
