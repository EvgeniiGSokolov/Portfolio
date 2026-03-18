import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})

export class UploaderComponent {
  fileName = '';
  filelist!: any;
  posted!: any;
  truthcond: boolean = true;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {

    const element = event.currentTarget as HTMLInputElement;
    this.filelist = element.files;

      const file:File = this.filelist[0];
      console.log(file);
   
      if (this.filelist) {

          this.fileName = file.name;

          const formData = new FormData();

          // formData.append("thumbnail", file);
          for (var i = 0; i < this.filelist.length; i++) { 
            formData.append("file[]", this.filelist[i]);
          }

          const token = localStorage.getItem('id_token');
          const tok = token?.replaceAll('"','');
          const contents = 'Bearer ' + tok;
          const headers = new HttpHeaders({'Authorization': contents});
          const upload$ = this.http.post('http://127.0.0.1:5000/uploader', formData, {headers: headers});

          upload$.subscribe(res => {this.posted = res;
            console.log(res);
          });
      }
  }

  remove_files() {
    const token = localStorage.getItem('id_token');
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});
    const removal$ = this.http.post('http://127.0.0.1:5000/delete', {'directive':'remove'}, {headers: headers});
    removal$.subscribe(res => {this.posted = res;
    console.log(res);}
    );
  }

  get_filenames() {
    const token = localStorage.getItem('id_token');
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});
    const retrieval$ = this.http.post('http://127.0.0.1:5000/file_list', {'directive':'give_filenames'}, {headers: headers});
    retrieval$.subscribe(res => {this.posted = res;
      console.log(res);}
      );
  }

  make_database() {
    const token = localStorage.getItem('id_token'); 
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});   
    this.truthcond = false;
    const dbmaker$ = this.http.post('http://127.0.0.1:5000/database', {'directive':'make_db'}, {headers: headers});
    dbmaker$.subscribe(res => {this.posted = res;
    console.log(res);
  this.truthcond = true;})
  }

  drop_database() {
    const token = localStorage.getItem('id_token'); 
    const tok = token?.replaceAll('"','');
    const contents = 'Bearer ' + tok;
    const headers = new HttpHeaders({'Authorization': contents});   
    this.truthcond = false;
    const dbmaker$ = this.http.post('http://127.0.0.1:5000/clear', {'directive':'make_db'}, {headers: headers});
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
