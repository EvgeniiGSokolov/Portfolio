import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ObservableInput } from 'rxjs';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.css']
})
export class ReferencesComponent {
word!: string;
posted!: any;
STRICT!: string;
truthcond: {"eng":string,"rus":string}[] = [
  {"eng":"yes","rus":"да"},
  {"eng":"no","rus":"нет"}
];
truth: boolean = true;
login: any;
obs!: ObservableInput<any>;

constructor(private http: HttpClient) { }

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

postData(address: string, word: string, strict: string, token: string|null) {
  const tok = token?.replaceAll('"','')
  //const body = {"word": word, "strict":strict, "Authorization": "Bearer" + token?.replaceAll('"','')};
  const body = {'word': word, 'strict':strict};
  const contents = 'Bearer ' + tok;
  const headers = new HttpHeaders({'Authorization': contents});
  console.log(headers);
  console.log(body);
  let r = this.http.post<{}>(address, body, {headers: headers});
  console.log(r);
  return r
  .pipe(catchError(this.handleError));
}  

find_refs(word: string, strict: string) {
  const token = localStorage.getItem('id_token')
  console.log(token)
  this.truth = false;
  let p = this.postData('http://127.0.0.1:5000/referencer', word, strict, token);
  p.subscribe(res => {
    this.posted = res;
    console.log(res);
    this.truth = true;
});
}
find_substrings(word: string, strict: string) {
  const token = localStorage.getItem('id_token')
  this.truth = false;
  let n = this.postData('http://127.0.0.1:5000/substrings',word, strict, token);
  n.subscribe(res => {
    this.posted = res;
    console.log(res);
    this.truth = true;
});
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
