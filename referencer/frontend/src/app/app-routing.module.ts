import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConcmenuComponent } from './concmenu/concmenu.component';
import { CollocationsComponent } from './collocations/collocations.component';
import { ConcordanceComponent } from './concordance/concordance.component';
import { ReferencesComponent } from './references/references.component';
import { UploaderComponent } from './uploader/uploader.component';
import { LoginComponent } from './login/login.component';
import { StartpageComponent } from './startpage/startpage.component';
import { DatabaserComponent } from './databaser/databaser.component';
import { OpenconcComponent } from './openconc/openconc.component';
import { RefsComponent } from './refs/refs.component';
import { RefuploadsComponent } from './refuploads/refuploads.component';
import { RefmenuComponent } from './refmenu/refmenu.component';
import { MenuComponent } from './menu/menu.component';
import { VectorizeComponent } from './vectorize/vectorize.component';
import { VecsearchComponent } from './vecsearch/vecsearch.component';
import { NgramsComponent } from './ngrams/ngrams.component';
import { VectrashComponent } from './vectrash/vectrash.component';
import { DelconcComponent } from './delconc/delconc.component';


const routes: Routes = [
  { path: '', redirectTo: '/startpage', pathMatch: 'full' },
  { path: 'startpage', component: StartpageComponent},
  { path: 'login', component: LoginComponent},
  {path: 'concordance_menu', component: ConcmenuComponent},
  {path: 'word_search', component: RefsComponent},
  {path:'uploader', component:UploaderComponent},
  {path: 'collocations', component:CollocationsComponent},
  {path: 'concordance', component:ConcordanceComponent},
  {path: 'databaser', component: DatabaserComponent},
  {path: 'open_conc', component: OpenconcComponent},
  {path: 'refuploads', component: RefuploadsComponent},
  {path: 'references', component: ReferencesComponent},
  {path:'referencer_menu', component: RefmenuComponent},
  {path:'menu', component: MenuComponent},
  {path:'vectorize',component: VectorizeComponent},
  {path:'vector_search',component: VecsearchComponent},
  {path:'ngrams',component: NgramsComponent},
  {path:'delete_vecs',component: VectrashComponent},
  {path:'delete_conc',component: DelconcComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

