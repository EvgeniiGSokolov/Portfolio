import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-vecsearch',
  templateUrl: './vecsearch.component.html',
  styleUrls: ['./vecsearch.component.css']
})

export class VecsearchComponent {
  dbname!: string;
  word!: string;
  fileName = '';
  filelist!: any;
  posted!: any;
  postref!:any;
  act_file: any;
  act_sentnum: any;
  act_wordform!: string;
  broadd: any;
  database!: string;
  Modelnames: any;
  Modelname: any;
  inhalt: any;
  param: boolean = false;
  truthcond: boolean = true;
  POS!: string;
  samepos!: string;
  contents!: any;
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
  samepostags: {'val':string,'text':string}[] = [
    {'val':'yes','text':'да'},
    {'val':'no','text':'нет'}
  ]

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
    const dbmaker$ = this.http.post('http://127.0.0.1:5000/n_closest', {'directive':'compare', 'modelname':this.Modelname, 'word':this.word,'graminfo':this.POS, 'same':this.samepos}, {headers: headers});
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

  find_da_refs(word: string) {
    const token = localStorage.getItem('id_token')
    const dotsplit = this.Modelname.split('.')[0]
    const subsplit = dotsplit.split('_')[1]
    this.database = subsplit;
    console.log(token)
    this.act_wordform = word;
    console.log(this.act_wordform);
    let p = this.http.post('http://127.0.0.1:5000/search', {lemOrTok:'lemma',word:word,DBname:subsplit});
    p.subscribe(res => {
      this.postref = res;
      this.inhalt = this.postref;
      console.log(this.inhalt);
  });
  }

  nullify() {
      this.inhalt=[];
  }

  closeBroader() {
    this.act_file = '';
  }

  broado_context(filename: string, sentence: string) {
    const token = localStorage.getItem('id_token')
    console.log(token)
    this.truthcond = false;
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});  
    this.act_file = filename;
    this.act_sentnum = sentence;
    const q = this.http.post('http://127.0.0.1:5000/broader_context',{DBname: this.database, filename: filename, sentence: sentence})
    q.subscribe(res => {
      this.broadd = res;
      console.log(res);
      this.truthcond = true;
    })
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


