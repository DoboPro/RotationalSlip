import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { GroundService } from './components/geometry/ground.service';
import * as jexcel from 'jexcel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

}
