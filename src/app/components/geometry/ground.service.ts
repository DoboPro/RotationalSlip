import { Injectable } from '@angular/core';
import * as THREE from 'three';

import { SceneService } from '../three/scene.service';

@Injectable({
  providedIn: 'root',
})
export class GroundService {
  private geometrys: THREE.Object3D[]; // 物理演算対象のジオメトリを登録する

  constructor(private scene: SceneService) {
    this.geometrys = new Array();
  }

  // データをクリアする
  private ClearData(): void {
    if (this.geometrys.length > 0) {
      // 線を削除する
      for (const mesh of this.geometrys) {
        while (mesh.children.length > 0) {
          const object = mesh.children[0];
          object.parent.remove(object);
        }
        this.scene.remove(mesh);
      }
      this.geometrys = new Array();
    }
    this.scene.clear();

  }

  // 入力データの表示
  public chengeData(L, H): void {
    this.ClearData();

    // 丘の作成 ---------------------------------------------------------
    const points = [];
    const Llength = L * 8;
    points.push(new THREE.Vector3(-Llength, 0, 0));
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(L, H, 0));
    points.push(new THREE.Vector3(Llength, H, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    this.geometrys.push(line);
  }

  public hillData(L, H):void{
    const hillShape = new THREE.Shape();
    hillShape.moveTo( -L*8, 0 );
    hillShape.lineTo( 0, 0 );
    hillShape.lineTo( L, H );
    hillShape.lineTo( L*8, H );
    hillShape.lineTo( L*8, -H);
    hillShape.lineTo( -L*8, -H);
    const geometry = new THREE.ShapeGeometry( hillShape );
    const hmaterial = new THREE.MeshBasicMaterial( { color: 0x8B4513});
    const hmesh = new THREE.Mesh( geometry, hmaterial ) ;
    hmesh.position.set(0, 0, -1);
    this.scene.add( hmesh );
    this.geometrys.push(hmesh);

    this.scene.render();
  }

  // 計算結果の表示
  public resultData(x, y, r, L, H): void {

    this.chengeData(L, H);

    this.scene.onFlg = true;

    // 円弧の作成 ------------------------------------------------------
    const hillShape = new THREE.Shape();
    hillShape.moveTo( -L*8, 0 );

    const cp = this.crossPoint(L, H, r, x, y);

    const xb = cp[0][0];
    const yb = cp[0][1];
    const xa = cp[1][0];
    const ya = cp[1][1];


    const points2 = [];
    const pi = Math.PI;

    const dega = -Math.atan((x - xa) / (y - ya)) - pi / 2;
    const degb = -Math.atan((y - yb) / (xb - x));

    const deg1 = (dega * 180) / pi;
    const deg2 = (degb * 180) / pi;
    const rat = deg2 - deg1; // 円弧の角度

    const n = 10; // 円弧の分割数

    const dl = rat / n;
    const rad = (dl * pi) / 180;

    points2.push(new THREE.Vector3(x, y, 0));
    points2.push(new THREE.Vector3(xa, ya, 0));
    if (xa < 0){
      hillShape.lineTo( xa, ya );
    } else {
      hillShape.lineTo( 0, 0 );
      hillShape.lineTo( xa, ya );
    }

    const nn = 50; // 円弧の分割数

    const dl2 = rat / nn;
    const rad2 = (dl2 * pi) / 180;


    let o1 = (xa - x) * Math.cos(rad2) - (ya - y) * Math.sin(rad2) + x;
    let o2 = (xa - x) * Math.sin(rad2) + (ya - y) * Math.cos(rad2) + y;

    for (let i = 1; i < 50; i++) {
      const oo1 = (o1 - x) * Math.cos(rad2) - (o2 - y) * Math.sin(rad2) + x;;
      const oo2 = (o1 - x) * Math.sin(rad2) + (o2 - y) * Math.cos(rad2) + y;;
      points2.push(new THREE.Vector3(oo1, oo2, 0));
      hillShape.lineTo( oo1, oo2);
      o1 = oo1;
      o2 = oo2;
    }
    points2.push(new THREE.Vector3(xb, yb, 0));
    hillShape.lineTo( xb, yb );
    if (xb < L){
      hillShape.lineTo( L, H );
    }
    points2.push(new THREE.Vector3(x, y, 0));

    const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
    const material2 = new THREE.LineBasicMaterial({
      color: 0x00ffff,
    });

    const line2 = new THREE.Line(geometry2, material2);
    this.scene.add(line2);
    this.geometrys.push(line2);


    hillShape.lineTo( L*8, H );
    hillShape.lineTo( L*8, -H);
    hillShape.lineTo( -L*8, -H);
    const geometry = new THREE.ShapeGeometry( hillShape );
    const hmaterial = new THREE.MeshBasicMaterial( { color: 0x8B4513});
    const hmesh = new THREE.Mesh( geometry, hmaterial ) ;
    this.scene.add( hmesh );
    this.geometrys.push(hmesh);

    // 中心点の作成 ----------------------------------------------------------
    const material5 = new THREE.MeshBasicMaterial({ color: 0xeeee00 });
    const geometry5 = new THREE.CircleGeometry(0.3, 100);
    const mesh = new THREE.Mesh(geometry5, material5);
    mesh.position.set(x, y, 0);
    this.scene.add(mesh);
    this.geometrys.push(mesh);

    // アニメーションオブジェクトの作成【実験用】-------------------------------
    // 丸の作成2
    const S1 = 0.5*r**2*(rat-Math.sin(rat));//弓形の面積S
　　const S2 = 1/10000*S1;//物体の面積をS1の固定値分の割合で小さく設定
    const radius = Math.sqrt(S2/(2*pi));

    const material = new THREE.MeshBasicMaterial( { color: 0x8B4513 } );
    const geom = new THREE.CircleBufferGeometry( radius*1.5, 12 );
    const temp = new THREE.Mesh( geom, material );
    const geolist: THREE.Mesh[] = new Array();
    const yc = y-r;
    const nk = (yb-yc)/(2*radius);
    let yp = yc;
    let xp = xa;
    for (let i = 0; i < nk; i++) {
      const ye = y-yp;
      const xe0 = Math.sqrt(r**2-ye**2)+x;
      let xe = xe0 - radius;
    if(yp<0){
      xp=-(xe-2*x);
    }else{
      xp = yp*L/H;
    }

      while ( xp+2*radius<xe ) {
        temp.position.set(xe, yp, -1);
        const mesh = temp.clone();
        geolist.push(mesh);
        this.geometrys.push(mesh);
        xe -= radius*2;
      }
      yp += radius*2;
    }

    //const cylinder1 = new THREE.Points(geom, material);
    this.scene.addBodies(radius*1.21, geolist); 


    // 動かない物理演算 オブジェクト -------------------------------------------------------
    this.scene.addRectangleGround(xa);
    //let oo3 = (xa - x) / r * (r + 10) + x;
    //let oo4 = (ya - y) / r * (r + 10) + y;
    //this.createGround(oo3, oo4);

    const n1 = 2 * pi * r / 0.2 * rat / 360; // 丸の個数

    const dl1 = rat / n1;
    const rad1 = (dl1 * pi) / 180;

    o1 = (xa - x) * Math.cos(rad1) - (ya - y) * Math.sin(rad1) + x;
    o2 = (xa - x) * Math.sin(rad1) + (ya - y) * Math.cos(rad1) + y;

    for (let i = 0; i < n1; i++) {
      const oo1 = (o1 - x) * Math.cos(rad1) - (o2 - y) * Math.sin(rad1) + x;
      const oo2 = (o1 - x) * Math.sin(rad1) + (o2 - y) * Math.cos(rad1) + y;
      const oo3 = (oo1 - x) / r * (r + 10) + x;
      const oo4 = (oo2 - y) / r * (r + 10) + y;
      this.createGround(oo3, oo4);
      o1 = oo1;
      o2 = oo2;
    }
    const oo3 = (xb - x) / r * (r + 10) + x;
    const oo4 = (yb - y) / r * (r + 10) + y;
    this.createGround(oo3, oo4);


    // 物理演算開始
    this.scene.setTimeout(10000);
    this.scene.render();
  }

  private createGround(tableX, tableY): void {
    this.scene.addGrounds(10, tableX, tableY); // addGrounds 動かない物理演算 オブジェクト
  }


  // 丘と円弧の交点座標を求める関数
  private crossPoint(L, H, r, x, y): number[][] {
    let xa = 0;
    let ya = 0;
    let xb = 0;
    let yb = 0;

    // ここに計算式
    // a x + b y + c = 0

    const a = 1;
    const b = -(L / H);
    const D = Math.abs(b * y + a * x);
    const I = Math.sqrt((a ** 2 + b ** 2) * r ** 2 - D ** 2);
    const J = a ** 2 + b ** 2;
    xa = (D * a - b * I) / J + x;
    ya = (D * b + a * I) / J + y;
    xb = (D * a + b * I) / J + x;
    yb = (D * b - a * I) / J + y;
    if (xb < 0) {
      let deltaB = -Math.sqrt(r ** 2 - y ** 2) + x;
      xb = deltaB;
      yb = 0;
    }
    if (xa > L) {
      const roota = Math.sqrt(
        (2 * L - 2 * x) ** 2 -
        4 *
        (L ** 2 + x ** 2 + y ** 2 + H ** 2 - 2 * H * y - 2 * L * x - r ** 2)
      );
      const deltaA = x - L + roota / 2;
      xa = L + deltaA;
      ya = H;

    }

    return [
      [xa, ya],
      [xb, yb],
    ];
  }

}
