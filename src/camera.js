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
    return new OrbitControls(camera, renderer.domElement);
}
