import { Injectable } from '@angular/core';
import * as THREE from 'three';
import * as Matter from 'matter-js';
import { OrbitControls } from '../libs/OrbitControls.js';


@Injectable({
  providedIn: 'root'
})
export class SceneService {

  // シーン
  private scene: THREE.Scene;
  public onFlg: boolean = false;

  // レンダラー
  private renderer: THREE.WebGLRenderer;

  // カメラ
  private camera: THREE.OrthographicCamera; //THREE.PerspectiveCamera;

  // Matter.js engine
  private bodie_list: THREE.Mesh[]; // 物理演算対象のジオメトリを登録する
  private Engine: any;
  private World: any;
  private Bodies: any;
  private engine: any;

  // 初期化
  public constructor() {
    // シーンを作成
    this.scene = new THREE.Scene();
    // シーンの背景を白に設定
    this.scene.background = new THREE.Color(0xf0f0f0);
    // レンダラーをバインド
    this.render = this.render.bind(this);
    this.renderer = null;
    // create a Matter.js engine
    this.Engine = Matter.Engine;
    this.World = Matter.World;
    this.Bodies = Matter.Bodies;
    this.engine = this.Engine.create({ render: { visible: false } });
    this.clear();
  }

  public OnInit(aspectRatio: number,
    canvasElement: HTMLCanvasElement,
    deviceRatio: number,
    Width: number,
    Height: number): void {
    // カメラ
    this.createCamera(Width, Height);
    // 環境光源
    this.add(new THREE.AmbientLight(0xf0f0f0));
    // レンダラー
    this.createRender(canvasElement,
      deviceRatio,
      Width,
      Height);

    // コントロール
    this.addControls();

    // run the engine
    this.Engine.run(this.engine);

  }

  // コントロール
  public addControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.damping = 0.2;
    controls.enableRotate = false;
    //controls.screenSpacePanning = false;
    controls.addEventListener('change', this.render);
  }


  // カメラの初期化
  public createCamera(w: number, h: number): void {

    this.camera = new THREE.OrthographicCamera(
      -w / 40,
      w / 30,
      h / 20,
      -h / 60,
      0.1,
      200
    );

    this.camera.position.set(0, 0, 10);
    this.scene.add(this.camera);
  }


  // レンダラーを初期化する
  public createRender(canvasElement: HTMLCanvasElement,
    deviceRatio: number,
    Width: number,
    Height: number): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setPixelRatio(deviceRatio);
    this.renderer.setSize(Width, Height);
    this.renderer.shadowMap.enabled = true;
  }

  // リサイズ
  public onResize(deviceRatio: number,
    Width: number,
    Height: number): void {
    //.camera.aspect = deviceRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(Width, Height);
    this.render();
  }

  // レンダリングする
  public render(): void {
    if (this.renderer === null) {
      return;
    }
    if (this.bodie_list !== null) {
      let i = 0;
      for (const b of this.engine.world.bodies) {
        if (b.isStatic === false) {
          const p = b.position; // d= 物理演算 matter.js で計算されたポジション
          const v: THREE.Mesh = this.bodie_list[i];
          // ポジションを更新
          const renderx = 0.1*p.x;
          const rendery = 0.1*p.y;
          v.position.x = renderx;
          v.position.y = -rendery;
          i++;
        }
      }
    }

    this.renderer.render(this.scene, this.camera);

    if (this.onFlg === true) {
      requestAnimationFrame(() => { this.render(); });
    }

  }

  public setTimeout(time): void {
    setTimeout(() => {
      this.clear()
    }, time);
  }

  // レンダリングのサイズを取得する
  public getBoundingClientRect(): ClientRect | DOMRect {
    return this.renderer.domElement.getBoundingClientRect();
  }

  // シーンにオブジェクトを追加する
  public add(...threeObject: THREE.Object3D[]): void {
    for (const obj of threeObject) {
      this.scene.add(obj);
    }
  }

  // シーンに物理演算オブジェクトを追加する
  public addBodies(radius: number, threeObject: THREE.Mesh[]): void {

    // create a Matter.js engine
    const circles = [];
    for (const obj of threeObject) {
      const radius2 = 10*radius;
      const objx = 10*obj.position.x;
      const objy = 10*obj.position.y;
      this.scene.add(obj);
      circles.push(this.Bodies.circle(objx, -objy, radius2, {
        friction: 1,    // 本体の摩擦
        density: 100     // 密度
      }));
    }
    this.World.add(this.engine.world, circles);
    this.bodie_list = threeObject;
  }

  // シーンに動かない物理演算オブジェクトを追加する
  public addGrounds(radius: number, x: number, y: number): void {
    const radius3 = 10*radius;
    const addGx = 10*x;
    const addGy = 10*y;
    this.World.add(this.engine.world,
      [this.Bodies.circle(addGx, -addGy, radius3, { isStatic: true })]);
  }

  public addRectangleGround(x: number): void {
    const XX = 10*x - 500;
    this.World.add(this.engine.world,
      [this.Bodies.rectangle(XX, 50, 1000, 100, { isStatic: true })]);
  }


  // シーンのオブジェクトを削除する
  public remove(...threeObject: THREE.Object3D[]): void {
    for (const obj of threeObject) {
      this.scene.remove(obj);
    }
  }

  // 物理演算オブジェクトをクリアする
  public clear(): void {
    this.bodie_list = null;
    this.World.clear(this.engine.world);
    this.onFlg = false;
  }

  public RendererDomElement(): Node {
    return this.renderer.domElement;
  }
}
