import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { ReferencesComponent } from './references/references.component';
import { UploadComponent } from './upload/upload.component';


const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  {path: 'menu', component: MenuComponent},
  {path: 'references', component: ReferencesComponent},
  {path: 'upload', component: UploadComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
