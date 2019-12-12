import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeeContainerComponent } from './bee-container/bee-container.component';


const routes: Routes = [
  { path: 'homepage', component: BeeContainerComponent },
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: '**', redirectTo: '/homepage' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
