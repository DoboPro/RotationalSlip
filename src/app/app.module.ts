import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ThreeComponent } from './components/three/three.component';

import { explain } from './explanation.component';
import { calculation } from './calculation.component';
import { InputNodeComponent } from './components/input/input-node/input-node.component';
import { SolidParamComponent } from './components/input/solid-param/solid-param.component';
import { MenuComponent } from './components/menu/menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WaitDialogComponent } from './components/wait-dialog/wait-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeComponent,
    explain,
    calculation,
    InputNodeComponent,
    SolidParamComponent,
    MenuComponent,
    WaitDialogComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
