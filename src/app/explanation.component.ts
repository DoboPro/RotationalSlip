import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { Router } from '@angular/router';

import { GroundService } from './components/geometry/ground.service';
import * as jexcel from 'jexcel';

@Component({
  selector: 'explain',
  templateUrl: './explanation.component.html',
  styleUrls: ['./app.component.scss']
})

export class explain {
  constructor(private router: Router){}
}
