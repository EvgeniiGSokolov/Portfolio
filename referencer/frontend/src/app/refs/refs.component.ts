import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ObservableInput } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-refs',
  templateUrl: './refs.component.html',
  styleUrls: ['./refs.component.css']
})
export class RefsComponent {
word!: string;
posted!: any;
STRICT!: string;
truthcond: {"eng":string,"rus":string}[] = [
  {"eng":"yes","rus":"да"},
  {"eng":"no","rus":"нет"}
];
truth: boolean = true;
login: any;
act_file!: string;
act_sentnum!: string;
broadc!: any;
obs!: ObservableInput<any>;
number: any;
contents!: [];
DBnames: any;
DBname: any;
ConcDownName: any;
postref: any;
fileUrl!: any;
concwordparam: boolean = false;
lemOrTok!: string;
entry_types: {"russ":string,"eng":string}[] = [
  {'russ':'словоформа','eng':'token'},{'russ':'лексема','eng':'lemma'},{'russ':'часть словоформы','eng':'substring'}
]

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

closeBroader() {
  this.act_file = '';
}

postData(address: string, lemOrTok: string, word: string, DBname: string, token: string|null) {
  const tok = token?.replaceAll('"','')
  //const body = {"word": word, "Authorization": "Bearer" + token?.replaceAll('"','')};
  const body = {'lemOrTok': lemOrTok, 'word': word, 'DBname': DBname};
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});
  console.log(headers);
  console.log(body);
  let r = this.http.post<{}>(address, body, {headers: headers});
  console.log(r);
  return r
  .pipe(catchError(this.handleError));
}  

find_refs(lemOrTok: string, word: string, DBname: string) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  let p = this.postData('http://127.0.0.1:5000/search', lemOrTok,word, DBname, token);
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

reactButton(s: any) {
  this.number = s.number;
  this.contents = s.contents;
}

prep_wordlist() {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  const tok = token?.replaceAll('"','');
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});   
  const p = this.http.post('http://127.0.0.1:5000/download_wordsearch', {'word':this.word, 'DBname':this.DBname, 'ConcName':this.ConcDownName, 
'result':this.posted.result, 'howmuch':this.posted.howmuch,'ipm':this.posted.ipm}, {headers: headers});
  p.subscribe(res => {
    this.postref = res;
    console.log(res);
    this.truth = true;
});  
}

down_wordlist() {
  //Надо сообразить. Не работает!
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  const data = this.postref.for_download;
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
    this.broadc = res;
    console.log(res);
    this.truth = true;
  })
}

wordtrig() {
  this.concwordparam = true;
}


checkwordtrig() {
  if (this.concwordparam == false){
    return false;
  }
  else {
    return true;
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

}

