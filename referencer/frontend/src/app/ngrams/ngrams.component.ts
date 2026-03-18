import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ngrams',
  templateUrl: './ngrams.component.html',
  styleUrls: ['./ngrams.component.css']
})

export class NgramsComponent {
  dbname!: string;
  vecmodelname!: string;
  fileName = '';
  filelist!: any;
  act_file!: string;
  act_sentnum!: string;
  broada: any;
  posted!: any;
  DBnames: any;
  DBname: any;
  NgramName: any;
  NsingleName: any;
  postgram: any;
  postsingle: any;
  param: boolean = false;
  postered!: any;
  fileUrl: any;
  truthcond: boolean = true;
  truth: boolean = true;
  mincount!: string;
  necessary_word: string = 'DUMMY';
  concngramparam: boolean = false;
  word_1!: string;
  word_2!: string;
  act_first: string = '';
  act_second: string = '';
  particular!: string;
  particulars: {'russ':string,'eng':string}[] = [
    {'russ': 'да', 'eng':'yes'},{'russ':'нет','eng':'no'}
  ]
  stopwords: {'russ':string,'eng':string}[] = [
    {'russ':'удалить','eng':'no'},{'russ':'оставить','eng':'yes'}
  ]
  stopword!: string;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
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

  find_bigrams() {
    const token = localStorage.getItem('id_token'); 
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});   
    this.truthcond = false;
    const bgrm$ = this.http.post('http://127.0.0.1:5000/bigrams', {'directive':'make_db', 'dbname':this.DBname, 'mincount':this.mincount, 'stopwords':this.stopword, 'necessary_word':this.necessary_word}, {headers: headers});
    bgrm$.subscribe(res => {this.posted = res;
    console.log(res);
  this.truthcond = true;})
  }

  prep_ngram() {
    const token = localStorage.getItem('id_token')
    console.log(token)
    this.truth = false;
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});
    if (this.postered != null) {
      const p = this.http.post('http://127.0.0.1:5000/download_ngram', {'DBname':this.DBname, 'ConcName':this.NgramName, 'result':this.posted.set_phrases,'instances':this.postered.result, 'w_1':this.act_first, 'w_2':this.act_second}, {headers: headers});
      p.subscribe(res => {
        this.postgram = res;
        console.log(res);
        this.truth = true;
    });  
    }   
    else {
      const p = this.http.post('http://127.0.0.1:5000/download_ngram', {'DBname':this.DBname, 'ConcName':this.NgramName, 'result':this.posted.set_phrases,'instances':[], 'w_1':this.act_first, 'w_2':this.act_second}, {headers: headers});
      p.subscribe(res => {
        this.postgram = res;
        console.log(res);
        this.truth = true;
    });  
    }

  }
  
  down_ngram() {
    //Надо сообразить. Не работает!
    const token = localStorage.getItem('id_token')
    console.log(token)
    this.truth = false;
    const data = this.postgram.for_download;
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

  closeBroader() {
    this.act_file = '';
  }

  prep_single() {
    const token = localStorage.getItem('id_token')
    console.log(token)
    this.truth = false;
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});
    const p = this.http.post('http://127.0.0.1:5000/download_ngram', {'DBname':this.DBname, 'ConcName':this.NsingleName, 'result':'NONE','instances':this.postered.result, 'w_1':this.act_first, 'w_2':this.act_second}, {headers: headers});
    p.subscribe(res => {
      this.postsingle = res;
      console.log(res);
      this.truth = true;
    });  

  }

  down_single() {
    //Надо сообразить. Не работает!
    const token = localStorage.getItem('id_token')
    console.log(token)
    this.truth = false;
    const data = this.postsingle.for_download;
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
  
  ngramtrig() {
    this.concngramparam = true;
  }
  
  
  checkngramtrig() {
    if (this.concngramparam == false){
      return false;
    }
    else {
      return true;
    }
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

  poster(address: string, DBname: string, word_1: string, word_2: string, mini_1: string, maxi_1: string, lemOrTok_1:string,lemOrTok_2:string, token: string|null) {
    const tok = token?.replaceAll('"','')
    //const body = {"word": word, "Authorization": "Bearer" + token?.replaceAll('"','')};
    const body = {'DBname': DBname, 'word_1': word_1, 'word_2': word_2, 'mini_1': mini_1, 'maxi_1':maxi_1, 'lemOrTok_1':lemOrTok_1,'lemOrTok_2':lemOrTok_2};
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});
    console.log(headers);
    console.log(body);
    let r = this.http.post<{}>(address, body, {headers: headers});
    console.log(r);
    return r;
  }  

  coll_finder(DBname: string, word_1: string, word_2: string) {
    const token = localStorage.getItem('id_token')
    console.log(token)
    this.truth = false;
    let p = this.poster('http://127.0.0.1:5000/collocates', DBname, word_1, word_2, '0','0','lemma','lemma', token);
    p.subscribe(res => {
      this.postered = res;
      console.log(res);
      this.truth = true;
      this.act_first = word_1;
      this.act_second = word_2;
  });
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
      this.broada = res;
      console.log(res);
      this.truth = true;
    })
  }

  dummy_clicker(elt: any) {
    if (elt.eng='no') {
      this.necessary_word = 'DUMMY';
    }
    else {
      this.necessary_word = this.necessary_word;
    }
  }
  closeTheButton() {
    this.postered = null;
  }


}




