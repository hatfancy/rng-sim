import * as THREE from 'three';
import { createCarModel, CarMeshes } from './carBuilder';
import { stateManager } from './state';
import { soundEngine } from './sound';
import { UIManager } from './ui';
import { CAR_CATALOG } from './data/cars';

class GameApp {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private ui: UIManager;

  private showcaseGroup: THREE.Group | null = null;
  private currentMeshes: CarMeshes | null = null;
  private lastTime: number = performance.now();

  constructor() {
    // 1. Scene & Canvas
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060913);
    this.scene.fog = new THREE.FogExp2(0x060913, 0.015);

    const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Camera focused on 3D Car Showcase Pedestal
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 2.5, 7.5);
    this.camera.lookAt(0, 0.6, 0);

    // 3. Lighting & Showroom Environment
    this.setupLighting();
    this.setupShowroom();

    // 4. Spawn initial showcased car from garage
    this.spawnShowcaseCar();

    // 5. Initialize UI Manager
    this.ui = new UIManager((modelId, isReveal) => {
      if (isReveal) {
        this.animateCarReveal(modelId, 2500);
      } else {
        this.spawnShowcaseCar(modelId);
      }
    });

    // 6. Audio unlock
    const unlockAudio = () => {
      soundEngine.init();
      window.removeEventListener('click', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);

    window.addEventListener('resize', this.onResize.bind(this));

    // 7. Render Loop
    requestAnimationFrame(this.animate.bind(this));
  }

  private setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambient);

    // Overhead showroom spotlight
    const spotLight = new THREE.SpotLight(0x38bdf8, 3.5, 30, Math.PI / 4, 0.5, 1.2);
    spotLight.position.set(0, 10, 3);
    spotLight.castShadow = true;
    this.scene.add(spotLight);

    // Rim lights for supercar reflections
    const rimLeft = new THREE.DirectionalLight(0xec4899, 1.8);
    rimLeft.position.set(-6, 3, -4);
    this.scene.add(rimLeft);

    const rimRight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimRight.position.set(6, 4, 3);
    this.scene.add(rimRight);
  }

  private setupShowroom() {
    // Pedestal turntable
    const pedestalGeo = new THREE.CylinderGeometry(3.6, 3.9, 0.25, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, -0.12, 0);
    pedestal.receiveShadow = true;
    this.scene.add(pedestal);

    // Neon Halo Ring around pedestal
    const haloGeo = new THREE.RingGeometry(3.65, 3.8, 48);
    haloGeo.rotateX(-Math.PI / 2);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 0.02, 0);
    this.scene.add(halo);
  }

  private spawnShowcaseCar(specificModelId?: string) {
    if (this.showcaseGroup) {
      this.scene.remove(this.showcaseGroup);
    }

    let model = CAR_CATALOG[0];
    let instance = undefined;

    if (specificModelId) {
      model = CAR_CATALOG.find(c => c.id === specificModelId) || CAR_CATALOG[0];
    } else {
      const activeObj = stateManager.getActiveCar();
      if (activeObj) {
        model = activeObj.model;
        instance = activeObj.instance;
      }
    }

    this.currentMeshes = createCarModel(model, instance);
    this.showcaseGroup = this.currentMeshes.root;
    this.showcaseGroup.position.set(0, 0, 0);
    this.scene.add(this.showcaseGroup);
  }

  public animateCarReveal(modelId: string, durationMs: number = 3000) {
    this.spawnShowcaseCar(modelId);
    if (!this.showcaseGroup) return;

    // Reset showcase position to submerged / distant
    this.showcaseGroup.position.set(0, -2.5, -3);
    this.showcaseGroup.rotation.y = -Math.PI * 0.4;

    const startTime = performance.now();
    const animateEntrance = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out

      if (this.showcaseGroup) {
        this.showcaseGroup.position.y = -2.5 + ease * 2.5; // rises up to 0
        this.showcaseGroup.position.z = -3 + ease * 3;     // drives forward to 0
      }

      if (progress < 1) {
        requestAnimationFrame(animateEntrance);
      }
    };
    requestAnimationFrame(animateEntrance);
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(time: number) {
    requestAnimationFrame(this.animate.bind(this));

    const dt = Math.min(0.05, (time - this.lastTime) / 1000);
    this.lastTime = time;

    // Smooth turntable rotation for the showcased 3D car
    if (this.showcaseGroup) {
      this.showcaseGroup.rotation.y += dt * 0.45;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

function initGame() {
  new GameApp();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
