import { Component } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'app-refmenu',
  templateUrl: './refmenu.component.html',
  styleUrls: ['./refmenu.component.css']
})
export class RefmenuComponent implements OnChanges {
login: any = 'none';
status: any = 'none';

ngOnInit() {
  this.login = localStorage.getItem('login');
  this.status = localStorage.getItem('status');
  console.log(this.login)
}

ngOnChanges(changes: SimpleChanges) {
  this.login = localStorage.getItem('login');
  console.log(this.login)
}

ngAfterContentInit() {
  this.login = localStorage.getItem('login');
  console.log(this.login)
}
}
