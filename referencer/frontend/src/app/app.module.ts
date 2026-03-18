import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReferencesComponent } from './references/references.component';
import { ConcordanceComponent } from './concordance/concordance.component'
import { ConcmenuComponent } from './concmenu/concmenu.component';
import { OpenconcComponent } from './openconc/openconc.component';
import { CollocationsComponent } from './collocations/collocations.component'
import { DatabaserComponent } from './databaser/databaser.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UploaderComponent } from './uploader/uploader.component';
import { LoginComponent } from './login/login.component';
import { StartpageComponent } from './startpage/startpage.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import {RefuploadsComponent} from './refuploads/refuploads.component';
import {RefsComponent} from './refs/refs.component';
import { RefmenuComponent } from './refmenu/refmenu.component';
import { MenuComponent } from './menu/menu.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {VectorizeComponent} from './vectorize/vectorize.component';
import { VecsearchComponent } from './vecsearch/vecsearch.component';
import { NgramsComponent } from './ngrams/ngrams.component';
import { VectrashComponent } from './vectrash/vectrash.component';
import { DelconcComponent } from './delconc/delconc.component';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  declarations: [
    AppComponent,
    ReferencesComponent,
    CollocationsComponent,
    ConcordanceComponent,
    ConcmenuComponent,
    UploaderComponent,
    LoginComponent,
    StartpageComponent,
    DatabaserComponent,
    OpenconcComponent,
    RefuploadsComponent,
    RefsComponent,
    RefmenuComponent,
    MenuComponent,
    VectorizeComponent,
    VecsearchComponent,
    NgramsComponent,
    VectrashComponent,
    DelconcComponent
  ],
  imports: [
    MatGridListModule,
    MatChipsModule,
    ScrollingModule,
    MatBadgeModule,
    MatFormFieldModule,
    HttpClientModule,
    FormsModule, //Эта штука нужна, чтобы NgModule работал.
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatExpansionModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatRadioModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
