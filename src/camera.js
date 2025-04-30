// Handles camera and OrbitControls setup
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.setZ(35);
    return camera;
}

export function createOrbitControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; // Disable camera panning
    return controls;
}

export function resetView(camera, controls) {
    camera.position.setZ(35);
    camera.position.x = 0;
    camera.position.y = 0;
    controls.target.set(0, 0, 0);
    controls.update();
}
