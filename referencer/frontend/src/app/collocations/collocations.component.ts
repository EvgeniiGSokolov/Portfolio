import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ObservableInput } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-collocations',
  templateUrl: './collocations.component.html',
  styleUrls: ['./collocations.component.css']
})
export class CollocationsComponent {
n_gram!: string;
DBnames: any;
DBname: any;
act_file!: string;
act_sentnum!: string;
broad: any;
lemOrTok_1!: string;
lemOrTok_2!: string;
lemOrTok_3!: string;
lemOrTok_4!: string;
postcoll: any;
conccollparam: boolean = false;
baseparam: boolean = false;
biparam_1: boolean = false;
biparam_2: boolean = false;
biparam_3: boolean = false;
biparam_4: boolean = false;
biparam_5: boolean = false;
biparam_6: boolean = false;
triparam_1: boolean = false;
triparam_2: boolean = false;
triparam_3: boolean = false;
triparam_4: boolean = false;
triparam_5: boolean = false;
triparam_6: boolean = false;
triparam_7: boolean = false;
triparam_8: boolean = false;
triparam_9: boolean = false;
triparam_10: boolean = false;
quparam_1: boolean = false;
quparam_2: boolean = false;
quparam_3: boolean = false;
quparam_4: boolean = false;
quparam_5: boolean = false;
quparam_6: boolean = false;
quparam_7: boolean = false;
quparam_8: boolean = false;
quparam_9: boolean = false;
quparam_10: boolean = false;
quparam_11: boolean = false;
quparam_12: boolean = false;
quparam_13: boolean = false;
quparam_14: boolean = false;
word_1!: string;
word_2!: string;
word_3!: string;
word_4!: string;
mini_1!: string;
maxi_1!: string;
mini_2!: string;
maxi_2!: string;
mini_3!: string;
maxi_3!: string;
posted!: any;
STRICT!: string;
CollDownName!: string;
n_length: {"russ":string,"length":string}[] = [
  {"russ":'два слова',"length":'2'},
  {"russ":'три слова',"length":'3'},
  {"russ":'четыре слова',"length":'4'},
]
entry_types: {"russ":string,"eng":string}[] = [
  {'russ':'словоформа','eng':'token'},{'russ':'лексема','eng':'lemma'},{'russ':'часть словоформы','eng':'substring'}
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
fileUrl: any;

constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  this.retrieveDB()
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

postData(address: string, DBname: string, word_1: string, word_2: string, mini_1: string, maxi_1: string, lemOrTok_1:string,lemOrTok_2:string, token: string|null) {
  const tok = token?.replaceAll('"','')
  //const body = {"word": word, "Authorization": "Bearer" + token?.replaceAll('"','')};
  const body = {'DBname': DBname, 'word_1': word_1, 'word_2': word_2, 'mini_1': mini_1, 'maxi_1':maxi_1, 'lemOrTok_1':lemOrTok_1,'lemOrTok_2':lemOrTok_2};
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});
  console.log(headers);
  console.log(body);
  let r = this.http.post<{}>(address, body, {headers: headers});
  console.log(r);
  return r
  .pipe(catchError(this.handleError));
}  

postData_tri(address: string, DBname: string, word_1: string, word_2: string, word_3: string,
  mini_1: string, maxi_1: string, mini_2: string, maxi_2: string,lemOrTok_1:string,lemOrTok_2:string, lemOrTok_3:string, token: string|null) {
  const tok = token?.replaceAll('"','')
  //const body = {'DBname': DBname, "word": word, "Authorization": "Bearer" + token?.replaceAll('"','')};
  const body = {'DBname': DBname, 'word_1': word_1, 'word_2': word_2, 'word_3': word_3, 'mini_1': mini_1, 'maxi_1':maxi_1,
   'mini_2': mini_2, 'maxi_2':maxi_2, 'lemOrTok_1':lemOrTok_1,'lemOrTok_2':lemOrTok_2, 'lemOrTok_3':lemOrTok_3};
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});
  console.log(headers);
  console.log(body);
  let r = this.http.post<{}>(address, body, {headers: headers});
  console.log(r);
  return r
  .pipe(catchError(this.handleError));
}  

postData_quadr(address: string, DBname: string, word_1: string, word_2: string, word_3: string, word_4:string,
  mini_1: string, maxi_1: string, mini_2: string, maxi_2: string, mini_3: string, maxi_3: string,
  lemOrTok_1:string,lemOrTok_2:string, lemOrTok_3:string, lemOrTok_4:string, token: string|null) {
  const tok = token?.replaceAll('"','')
  //const body = {"word": word, "Authorization": "Bearer" + token?.replaceAll('"','')};
  const body = {'DBname': DBname, 'word_1': word_1, 'word_2': word_2, 'word_3': word_3, 'word_4': word_4,
   'mini_1': mini_1, 'maxi_1':maxi_1,
   'mini_2': mini_2, 'maxi_2':maxi_2,
   'mini_3': mini_3, 'maxi_3':maxi_3,
   'lemOrTok_1':lemOrTok_1,'lemOrTok_2':lemOrTok_2, 'lemOrTok_3':lemOrTok_3, 'lemOrTok_4':lemOrTok_4};
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});
  console.log(headers);
  console.log(body);
  let r = this.http.post<{}>(address, body, {headers: headers});
  console.log(r);
  return r
  .pipe(catchError(this.handleError));
}  

find_colls(DBname: string, word_1: string, word_2: string, mini_1: string, maxi_1: string, lemOrTok_1: string, lemOrTok_2:string) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  let p = this.postData('http://127.0.0.1:5000/collocates', DBname, word_1, word_2, mini_1,maxi_1,lemOrTok_1,lemOrTok_2, token);
  p.subscribe(res => {
    this.posted = res;
    console.log(res);
    this.truth = true;
});
}

find_colls_tri(DBname: string, word_1: string, word_2: string, word_3:string,
   mini_1: string, maxi_1: string, mini_2: string, maxi_2: string,
   lemOrTok_1: string, lemOrTok_2:string, lemOrTok_3: string) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  let p = this.postData_tri('http://127.0.0.1:5000/trigram_collocates', DBname, word_1, word_2, word_3,
   mini_1,maxi_1,mini_2,maxi_2,lemOrTok_1,lemOrTok_2,lemOrTok_3, token);
  p.subscribe(res => {
    this.posted = res;
    console.log(res);
    this.truth = true;
});
}

find_colls_quad(DBname: string, word_1: string, word_2: string, word_3:string,word_4:string,
  mini_1: string, maxi_1: string, mini_2: string, maxi_2: string,mini_3:string,maxi_3:string,
  lemOrTok_1: string, lemOrTok_2:string, lemOrTok_3: string, lemOrTok_4: string) {
 const token = localStorage.getItem('id_token')
 console.log(token)
 this.truth = false;
 let p = this.postData_quadr('http://127.0.0.1:5000/quadrigram_collocates', DBname, word_1, word_2, word_3,word_4,
  mini_1,maxi_1,mini_2,maxi_2,mini_3,maxi_3,
  lemOrTok_1,lemOrTok_2,lemOrTok_3,lemOrTok_4, token);
 p.subscribe(res => {
   this.posted = res;
   console.log(res);
   this.truth = true;
});
}

retrieveDB() {
  let p = this.http.get<any>('http://127.0.0.1:5000/list_dbs');
  console.log(p);
  p.subscribe(res => {this.DBnames = res;
    console.log(res)});
}

prep_coll() {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  const tok = token?.replaceAll('"','');
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});   
  const p = this.http.post('http://127.0.0.1:5000/download_collsearch', {word_1:this.word_1, word_2:this.word_2, word_3:this.word_3, word_4:this.word_4, DBname:this.DBname, ConcName:this.CollDownName, result:this.posted.result, 'howmuch':this.posted.howmuch}, {headers: headers});
  p.subscribe(res => {
    this.postcoll = res;
    console.log(res);
    this.truth = true;
});  
}

down_coll() {
  //Надо сообразить. Не работает!
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  const data = this.postcoll.for_download;
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

broader_context(DBname: string,filename: string, sentence: string) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  const tok = token?.replaceAll('"','');
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});  
  this.act_file = filename;
  this.act_sentnum = sentence;
  const q = this.http.post('http://127.0.0.1:5000/broader_context',{DBname: DBname, filename: filename, sentence: sentence})
  q.subscribe(res => {
    this.broad = res;
    console.log(res);
    this.truth = true;
  })
}

closeBroader() {
  this.act_file = '';
}

wordtrig() {
  this.conccollparam = true;
}


checkwordtrig() {
  if (this.conccollparam == false){
    return false;
  }
  else {
    return true;
  }
}

reactButton(s: any) {
  this.number = s.number;
  this.contents = s.contents;
}

check() {
  if (this.truth == true) {
    return true;
  }
  else {
    return false;
  }
}

}
