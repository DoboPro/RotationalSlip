import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { explain } from './explanation.component';
import { calculation } from './calculation.component';

const routes: Routes = [
  {path:'', redirectTo:'explain', pathMatch:'full'},
  {path:'explain',component: explain},
  {path:'calculation',component: calculation},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
