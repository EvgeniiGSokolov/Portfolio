import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ObservableInput } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-concordance',
  templateUrl: './concordance.component.html',
  styleUrls: ['./concordance.component.css']
})
export class ConcordanceComponent {
act_file!: string;
act_sentnum!: string;
n_gram!: string;
upper!: string;
lower!: string;
postconc!: any;
postdown!: any;
broadcont!: any;
respost!: any;
fileUrl!: any;
STRICT!: string;
DBnames: any;
DBname: any;
ConcType: any;
ConcName!: string;
ConcDownName!: string;
collapsed: boolean = true;
n_length: {"russ":string,"length":string}[] = [
  {"russ":'два слова',"length":'2'},
  {"russ":'три слова',"length":'3'},
  {"russ":'четыре слова',"length":'4'},
]
entry_types: {"russ":string,"eng":string}[] = [
  {'russ':'словоформа','eng':'token'},{'russ':'лексема','eng':'lemma'}
]
conctypes: {"russ":string,"eng":string}[] = [
  {'russ':'алфавитный','eng':'alphabetic'},{'russ':'обратный','eng':'reversed'},{'russ':'частотный','eng':'frequency'}
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
concparam: boolean = false;
concdownparam: boolean = false;
POS!: string;
postags: { "short": string, "russ": string }[] = [
  { "short": "all", "russ": "любая" },
  { "short": "S", "russ": "существительное" },
  { "short": "V", "russ": "глагол" },
  { "short": "A", "russ": "прилагательное" },
  { "short": "ADV", "russ": "наречие" },
  { "short": "SPRO", "russ": "местоимение-существительное" },
  { "short": "APRO", "russ": "местоимение-прилагательное" },
  { "short": "PR", "russ": "предлог" }
];

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

conctrig() {
  this.concparam = true;
}

concdowntrig() {
  this.concdownparam = true;
}

checktrig() {
  if (this.concparam == false){
    return false;
  }
  else {
    return true;
  }
}

checkdowntrig() {
  if (this.concdownparam == false){
    return false;
  }
  else {
    return true;
  }
}

postIt(address: string, DBname: string, ConcType: string, upper: string, lower: string, pos: string, token: string|null) {
  const tok = token?.replaceAll('"','')
  //const body = {"word": word, "Authorization": "Bearer" + token?.replaceAll('"','')};
  const body = {'DBname': DBname, 'conctype': ConcType, 'upper': upper, 'lower': lower, 'pos':pos};
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});
  console.log(headers);
  console.log(body);
  let r = this.http.post<{}>(address, body, {headers: headers});
  console.log(r);
  return r
  .pipe(catchError(this.handleError));
}  


concordate(DBname: string, ConcType: string, upper: string, lower: string) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  let p = this.postIt('http://127.0.0.1:5000/full_concordance', DBname, ConcType, upper, lower, this.POS, token);
  p.subscribe(res => {
    this.postconc = res;
    console.log(res);
    this.truth = true;
});
}

post_ready_conc(address: string, DBname: string, ConcName: string, concordance: {}, token: string|null) {
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

save_concordance(DBname: string, ConcName: string, concordance: {}) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  let p = this.post_ready_conc('http://127.0.0.1:5000/concordance_saver', DBname, ConcName, concordance, token);
  p.subscribe(res => {
    this.respost = res;
    console.log(res);
    this.truth = true;
});  
}

prep_concordance(DBname: string, ConcName: string, concordance: {}) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  let p = this.post_ready_conc('http://127.0.0.1:5000/download_concordance', DBname, ConcName, concordance, token);
  p.subscribe(res => {
    this.postdown = res;
    console.log(res);
    this.truth = true;
});  
}

down_concordance() {
  //Надо сообразить. Не работает!
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  const data = this.postdown.for_download;
  const binary = atob(data);
  //console.log(binary)
  const byteNumbers = new Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
  byteNumbers[i] = binary.charCodeAt(i);
  };
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type:'application/octet-stream'});
  this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
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
    this.broadcont = res;
    console.log(res);
    this.truth = true;
  })
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

closeButton(s: any) {
  this.contents = [];
}

closeBroader() {
  this.act_file = '';
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

}
