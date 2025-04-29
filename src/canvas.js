// Handles renderer and canvas setup
import * as THREE from 'three';

export function createRenderer() {
    const renderer = new THREE.WebGL1Renderer({
        canvas: document.querySelector('#bg'),
        alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.outerHeight);
    return renderer;
}

export function createScene() {
    return new THREE.Scene();
}
