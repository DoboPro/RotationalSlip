import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener, Renderer2, NgZone } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from '../libs/OrbitControls.js';
import { DragControls } from '../libs/DragControls.js';
import { TransformControls } from '../libs/TransformControls.js';

import { SceneService } from './scene.service';

@Component({
  selector: 'app-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.scss']
})
export class ThreeComponent implements AfterViewInit {

  @ViewChild('myCanvas', { static: true }) private canvasRef: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor(private ngZone: NgZone,
              private scene: SceneService) {
    THREE.Object3D.DefaultUp.set(0, 1, 0);
  }

  ngAfterViewInit() {
    this.scene.OnInit(this.getAspectRatio(),
                      this.canvas,
                      devicePixelRatio,
                      window.innerWidth,
                      window.innerHeight - 240, 
                      );

    const element = this.scene.RendererDomElement();
    const div = document.getElementById('myCanvas');        // ボタンを置きたい場所の手前の要素を取得
    div.parentNode.insertBefore(element, div.nextSibling);  // ボタンを置きたい場所にaタグを追加

    // レンダリングする
    this.animate();
  }

  animate(): void {
    this.scene.render();
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('DOMContentLoaded', () => {
      this.scene.render();
      });
    });
  }

  // マウスクリック時のイベント
  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent) {
    const mouse: THREE.Vector2 = this.getMousePosition(event);
    // まだ、何もしない
  }

  // マウスクリック時のイベント
  @HostListener('mouseup', ['$event'])
  public onMouseUp(event: MouseEvent) {
    const mouse: THREE.Vector2 = this.getMousePosition(event);
    // まだ、何もしない
  }

  // マウス移動時のイベント
  @HostListener('mousemove', ['$event'])
  public onMouseMove(event: MouseEvent) {
    const mouse: THREE.Vector2 = this.getMousePosition(event);
    // まだ、何もしない
  }

  // マウス位置とぶつかったオブジェクトを検出する
  private getMousePosition(event: MouseEvent): THREE.Vector2 {
    event.preventDefault();
    const rect = this.scene.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
    return mouse;
  }

  // ウインドウがリサイズした時のイベント処理
  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {
    this.scene.onResize(this.getAspectRatio(),
                        window.innerWidth,
                        window.innerHeight - 120 );
  }

  private getAspectRatio(): number {
    if (this.canvas.clientHeight === 0) {
      return 0;
    }
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

}
