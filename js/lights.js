import * as THREE from 'three';

const createDirectionalLight = (color, intensity, position) => {
  const l = new THREE.DirectionalLight(color, intensity);
  l.position.set(...position);
  return l;
}

const createPointLight = (color, strength, distance, cords) => {
  const l = new THREE.PointLight(color, strength, distance);
  l.position.set(...cords);
  return l;
}

const createMarker = (color, diameter, complexity, cords) => {
  const geo = new THREE.SphereGeometry(diameter, complexity, complexity);
  const mat = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...cords);
  return mesh;
}

const createLights = (scene, { markers, color, ambiance, strength, distance, cords }) => {
  if (ambiance) {
    // scene.add(createDirectionalLight(0x222222, 3, [0, 200, 0]));
    scene.add(createDirectionalLight(0x1A1A20, 3, [100, 20, 0]));
    scene.add(createDirectionalLight(0x1A1F1A, 3, [-100, 20, 0]));
  }

  if (markers) {
    const markIt = (c) => scene.add(createMarker(0x8888FF, 0.05, 16, c));
    cords.forEach(markIt)
  }

  const lightIt = (c) => scene.add(createPointLight(color, strength, distance, c))
  cords.forEach(lightIt);
}

export { createLights };