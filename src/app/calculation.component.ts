import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { Router } from '@angular/router';

import { GroundService } from './components/geometry/ground.service';
import * as jexcel from 'jexcel';

@Component({
  selector: 'calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./app.component.scss']
})

export class calculation implements OnInit {

  @ViewChild("spreadsheet") spreadsheet: ElementRef;

  public L: number; // 斜面の水平長さ
  public H : number; // 斜面の高さ
  public c: number; // 土の粘着力
  public fi: number; // 土のまさつ角
  public rt: number; // 土の単位体積重量
  public x:number;//円弧の中心座標
  public y:number;//円弧の中心座標
  public R:number;//円弧の半径
  public F:number;//安全率
  public myElement = document.getElementById('result');

 

  constructor(
    private ground: GroundService,
    private router: Router,
    private http: HttpClient) {
      // 初期値
      this.L= 10;
      this.H = 20;
      this.c = 30;
      this.fi = 10;
      this.rt = 16;
  }


  ngOnInit() {
    this.chengeData();
    }

  chengeData() {
    // 円弧を書かない
    this.ground.chengeData(this.L, this.H);
    this.ground.hillData(this.L, this.H);
}

  
  calc() {
    

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const body = {
      "L": this.L,
      "H": this.H,
      "c": this.c,
      "fi": this.fi,
      "rt": this.rt
    };


    console.log(body);

    const js: string = JSON.stringify(body);


    this.http.post(
      'https://asia-northeast1-the-structural-engine.cloudfunctions.net/function-2',
      js,
      httpOptions
    ).toPromise()
      .then((response) => {
        if ('error' in response || this.L < 1 || this.L > 999 || this.H < 1 || this.H > 999 || this.c < 1 || this.c > 999|| this.fi < 1 || this.fi >= 180 || this.rt < 1) {
          alert('解析に失敗しました\nエラーメッセージ：' + response['error']);
        } else {
          const F = response['F'];
          const R = response['R'];
          const x = response['x'];
          const y = response['y'];
          this.x = response['x'];
          this.y= response['y'];
          this.R = response['R'];
          this.F= response['F'];

          alert('安全率 F=' + F.toString() +
            '\n半径 R=' + R.toString() +
            '\n円弧の中心座標 x=' + x.toString() +
            '\n円弧の中心座標 y=' + y.toString() 
          );
          // 円弧を書く
          this.ground.resultData(x, y, R, this.L, this.H);
          const elem = document.getElementById("result").style;
          const myStyle = {
          display:'block'
        }
      
          for(const prop in myStyle) {
            elem[prop] = myStyle[prop];
          }
          
      }
      },
        error => {
          alert('解析に失敗しました\n通信状態：' + error.statusText + '\nエラーメッセージ：' + error.message);
        }
      );
  }

}
