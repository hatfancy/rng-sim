import * as THREE from 'three';
import { CarModelDef, PlayerCarInstance } from './types';

export interface CarMeshes {
  root: THREE.Group;
  bodyMesh: THREE.Mesh;
  accentMeshes: THREE.Mesh[];
  glassMesh: THREE.Mesh;
  wheels: THREE.Group[];
  brakeCalipers: THREE.Mesh[];
  headlights: THREE.Light[];
  taillights: THREE.Mesh[];
  exhaustPipes: THREE.Vector3[];
  neonLight?: THREE.PointLight;
}

export function createCarModel(def: CarModelDef, instance?: PlayerCarInstance): CarMeshes {
  const root = new THREE.Group();
  root.castShadow = true;
  root.receiveShadow = true;

  const color = instance?.paintColor || def.bodyColor;
  const accentColor = instance?.accentColor || def.accentColor || '#111827';
  const neonColor = instance?.neonColor;

  // Materials
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.85,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor),
    metalness: 0.6,
    roughness: 0.4,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0f172a'),
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    transparent: true,
    opacity: instance ? 1.0 - (instance.tintLevel * 0.7) : 0.7,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.95,
    roughness: 0.08,
  });

  const rubberMaterial = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.85,
    metalness: 0.1,
  });

  const emissiveWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const emissiveRed = new THREE.MeshBasicMaterial({ color: 0xff1122 });

  const wheels: THREE.Group[] = [];
  const accentMeshes: THREE.Mesh[] = [];
  const brakeCalipers: THREE.Mesh[] = [];
  const headlights: THREE.Light[] = [];
  const taillights: THREE.Mesh[] = [];
  const exhaustPipes: THREE.Vector3[] = [];

  // Procedural body building based on bodyType
  let bodyWidth = 1.85;
  let bodyHeight = 0.65;
  let bodyLength = 4.2;
  let cabinPos = new THREE.Vector3(0, 0.7, -0.2);
  let cabinGeo: THREE.BufferGeometry;

  if (def.bodyType === 'formula') {
    bodyWidth = 1.0;
    bodyHeight = 0.45;
    bodyLength = 4.4;
    cabinGeo = new THREE.BoxGeometry(0.7, 0.35, 1.2);
    cabinPos.set(0, 0.45, 0.1);
  } else if (def.bodyType === 'hypercar' || def.bodyType === 'supercar') {
    bodyWidth = 1.95;
    bodyHeight = 0.55;
    bodyLength = 4.3;
    cabinGeo = new THREE.BoxGeometry(1.4, 0.5, 2.0);
    cabinPos.set(0, 0.62, -0.15);
  } else if (def.bodyType === 'muscle' || def.bodyType === 'classic') {
    bodyWidth = 1.9;
    bodyHeight = 0.7;
    bodyLength = 4.4;
    cabinGeo = new THREE.BoxGeometry(1.45, 0.6, 2.2);
    cabinPos.set(0, 0.75, -0.25);
  } else if (def.bodyType === 'hatchback') {
    bodyWidth = 1.75;
    bodyHeight = 0.72;
    bodyLength = 3.8;
    cabinGeo = new THREE.BoxGeometry(1.45, 0.68, 2.3);
    cabinPos.set(0, 0.78, -0.3);
  } else {
    cabinGeo = new THREE.BoxGeometry(1.4, 0.58, 2.1);
    cabinPos.set(0, 0.7, -0.2);
  }

  const mainBodyGeo = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyLength);
  const bodyMesh = new THREE.Mesh(mainBodyGeo, bodyMaterial);
  bodyMesh.position.y = 0.45;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  root.add(bodyMesh);

  // Cabin / Greenhouse
  const cabinMesh = new THREE.Mesh(cabinGeo, glassMaterial);
  cabinMesh.position.copy(cabinPos);
  cabinMesh.castShadow = true;
  root.add(cabinMesh);

  // Hood / Nose sloping bevel
  const hoodFrontGeo = new THREE.BoxGeometry(bodyWidth * 0.92, 0.25, 0.8);
  const hoodFront = new THREE.Mesh(hoodFrontGeo, bodyMaterial);
  hoodFront.position.set(0, 0.38, 1.8);
  hoodFront.rotation.x = 0.15;
  root.add(hoodFront);

  // Front Splitter / Diffuser
  const splitterGeo = new THREE.BoxGeometry(bodyWidth * 1.02, 0.08, 0.9);
  const splitter = new THREE.Mesh(splitterGeo, accentMaterial);
  splitter.position.set(0, 0.18, 1.95);
  root.add(splitter);
  accentMeshes.push(splitter);

  // Rear Wing / Spoiler for sports, supercars, hypercars & F1
  if (['sports', 'supercar', 'hypercar', 'formula'].includes(def.bodyType)) {
    const wingGeo = new THREE.BoxGeometry(1.8, 0.06, 0.45);
    const wing = new THREE.Mesh(wingGeo, accentMaterial);
    wing.position.set(0, 1.05, -1.95);
    wing.rotation.x = -0.05;
    root.add(wing);
    accentMeshes.push(wing);

    // Wing struts
    const strutGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.35);
    const strutLeft = new THREE.Mesh(strutGeo, chromeMaterial);
    strutLeft.position.set(-0.55, 0.88, -1.95);
    const strutRight = strutLeft.clone();
    strutRight.position.x = 0.55;
    root.add(strutLeft, strutRight);
  }

  // Headlights
  const headlightGeo = new THREE.BoxGeometry(0.35, 0.12, 0.05);
  const hlLeft = new THREE.Mesh(headlightGeo, emissiveWhite);
  hlLeft.position.set(-0.65, 0.5, 2.15);
  const hlRight = hlLeft.clone();
  hlRight.position.x = 0.65;
  root.add(hlLeft, hlRight);

  // Taillights
  const taillightGeo = new THREE.BoxGeometry(0.4, 0.12, 0.05);
  const tlLeft = new THREE.Mesh(taillightGeo, emissiveRed);
  tlLeft.position.set(-0.65, 0.55, -2.15);
  const tlRight = tlLeft.clone();
  tlRight.position.x = 0.65;
  root.add(tlLeft, tlRight);
  taillights.push(tlLeft, tlRight);

  // Wheels creation (4 wheels)
  const wheelRadius = def.bodyType === 'formula' ? 0.38 : (def.bodyType === 'hatchback' ? 0.32 : 0.35);
  const wheelWidth = def.bodyType === 'formula' || def.bodyType === 'hypercar' ? 0.36 : 0.28;
  const wheelPositions = [
    new THREE.Vector3(-0.95, wheelRadius, 1.35),  // Front Left
    new THREE.Vector3(0.95, wheelRadius, 1.35),   // Front Right
    new THREE.Vector3(-0.95, wheelRadius, -1.35), // Rear Left
    new THREE.Vector3(0.95, wheelRadius, -1.35)   // Rear Right
  ];

  wheelPositions.forEach((pos, idx) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.copy(pos);

    // Tire
    const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMesh = new THREE.Mesh(tireGeo, rubberMaterial);
    tireMesh.castShadow = true;
    wheelGroup.add(tireMesh);

    // Rim
    const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.7, wheelRadius * 0.7, wheelWidth * 1.02, 16);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, chromeMaterial);
    wheelGroup.add(rimMesh);

    // Brake Caliper
    const caliperGeo = new THREE.BoxGeometry(0.08, 0.15, 0.12);
    const caliperMat = new THREE.MeshStandardMaterial({
      color: idx % 2 === 0 ? 0xff2222 : 0xfacc15,
      metalness: 0.8,
      roughness: 0.2,
    });
    const caliper = new THREE.Mesh(caliperGeo, caliperMat);
    caliper.position.set(pos.x > 0 ? -0.1 : 0.1, wheelRadius * 0.3, 0);
    wheelGroup.add(caliper);
    brakeCalipers.push(caliper);

    wheels.push(wheelGroup);
    root.add(wheelGroup);
  });

  // Exhaust tips at rear
  exhaustPipes.push(new THREE.Vector3(-0.45, 0.25, -2.15));
  exhaustPipes.push(new THREE.Vector3(0.45, 0.25, -2.15));

  exhaustPipes.forEach(pos => {
    const pipeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 12);
    pipeGeo.rotateX(Math.PI / 2);
    const pipe = new THREE.Mesh(pipeGeo, chromeMaterial);
    pipe.position.copy(pos);
    root.add(pipe);
  });

  // Underglow neon if configured
  let neonLight: THREE.PointLight | undefined;
  if (neonColor) {
    neonLight = new THREE.PointLight(neonColor, 3.5, 4.5);
    neonLight.position.set(0, 0.1, 0);
    root.add(neonLight);

    // Neon strip mesh for visual glow underneath
    const neonStripGeo = new THREE.PlaneGeometry(1.6, 3.2);
    neonStripGeo.rotateX(-Math.PI / 2);
    const neonMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(neonColor),
      transparent: true,
      opacity: 0.7,
    });
    const neonStrip = new THREE.Mesh(neonStripGeo, neonMat);
    neonStrip.position.set(0, 0.08, 0);
    root.add(neonStrip);
  }

  return {
    root,
    bodyMesh,
    accentMeshes,
    glassMesh: cabinMesh,
    wheels,
    brakeCalipers,
    headlights,
    taillights,
    exhaustPipes,
    neonLight,
  };
}

