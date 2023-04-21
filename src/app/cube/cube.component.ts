import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements AfterViewInit {

    @ViewChild('canvas')
    private canvasRef: ElementRef = new ElementRef<HTMLCanvasElement>(document.createElement('canvas'));

    //Cube properties

    @Input() public rotationSpeedX: number = 0.05;

    @Input() public rotationSpeedY: number = 0.01;

    @Input() public size: number = 200;

    @Input() public texture: string = '/assets/texture.jpg';

    //Stage Properties

    @Input() public cameraZ: number = 400;

    @Input() public fieldOfView: number = 1;

    @Input('nearClipping') public nearClippingPane: number = 1;

    @Input('farClipping') public farClippingPane: number = 1000;

    //Helper Properties (Private Properties)

    private camera!: THREE.PerspectiveCamera;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }
    private loader = new THREE.TextureLoader();
    private geometry = new THREE.BoxGeometry(1, 1, 1);
    private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });

    private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

    private renderer!: THREE.WebGLRenderer;

    private scene!: THREE.Scene;

    /**
     * Create the scene
     * 
     * @private
     * @memenberof CubeComponent
     */
    private createScene() {
      //Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);
      this.scene.add(this.cube);
      //Camera
      let aspectRadio = this.getAspectRatio();
      this.camera = new THREE.PerspectiveCamera(
        this.fieldOfView,
        aspectRadio,
        this.nearClippingPane,
        this.farClippingPane
      )
      this.camera.position.z = this.cameraZ;
    }
    
    private getAspectRatio() {
      return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    /**
     * Animate the cube
     * 
     * @private
     * @memenberof CubeComponent
     */
    private animateCube() {
      this.cube.rotation.x += this.rotationSpeedX;
      this.cube.rotation.y += this.rotationSpeedY;
    }

    /**
     * Start the rendering loop
     * 
     * @private
     * @memenberof CubeComponent
     */
     
    private startRenderingLoop() {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
      this.renderer.setPixelRatio(devicePixelRatio);
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

      let component: CubeComponent = this;
      (function render() {
        requestAnimationFrame(render);
        component.animateCube();
        component.renderer.render(component.scene, component.camera);
      })();
    
    }

    ngAfterViewInit(): void {
        this.createScene();
        this.startRenderingLoop();
    }
}
