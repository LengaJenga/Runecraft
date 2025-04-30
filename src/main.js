console.log('main.js loaded');

// =========================
// Imports and Dependencies
// =========================
import { createRenderer, createScene, resizeRendererToDisplaySize } from './canvas.js';
import { createCamera, createOrbitControls, resetView } from './camera.js';
import { createSkinMaterial, loadSteveModel } from './modelLoader.js';
import { guiSettings, initGUI } from './datgui.js';
import * as THREE from 'three';
import './barebonesPartGui.js';

// =========================
// Scene, Camera, Renderer Setup
// =========================
const scene = createScene();
const renderer = createRenderer();
const camera = createCamera();
const OrbitCamera = createOrbitControls(camera, renderer);

// =========================
// GUI Initialization
// =========================
initGUI(() => resetView(camera, OrbitCamera));

renderer.render(scene, camera);

// =========================
// Model and Material Setup
// =========================
const skinMaterial = createSkinMaterial();
let SteveModel = null;

loadSteveModel(scene, skinMaterial, (model) => {
    SteveModel = model;
});

// =========================
// Window Resize Handling
// =========================
function onWindowResize() {
    resizeRendererToDisplaySize(renderer);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', onWindowResize);

// =========================
// Animation Loop Variables
// =========================
let rotationTime = 0;
const rotationDuration = 4; // seconds for a full ease-in-out cycle

// =========================
// Animation Loop
// =========================
function AnimateScene() {
    requestAnimationFrame(AnimateScene);
    if (SteveModel) {
        if (guiSettings.rotationEnabled) {
            rotationTime += (0.007 * guiSettings.rotationSpeed);
            SteveModel.rotation.y = Math.sin(rotationTime * Math.PI / rotationDuration) * (Math.PI / 8);
        }
    }
    OrbitCamera.update();
    renderer.render(scene, camera);
}

AnimateScene();

// =========================
// UI: Skin Preview Image in the top left
// Also lets people download it this way :)
// =========================
document.addEventListener('DOMContentLoaded', () => {
        const skinPreview = document.createElement('img');
    skinPreview.src = 'Resources/Textures/Skin.png';
    skinPreview.style.position = 'absolute';
    skinPreview.style.top = '16px';
    skinPreview.style.left = '16px';
    skinPreview.style.width = '8vw'; // Dynamic width based on viewport
    skinPreview.style.height = 'auto'; // Maintain aspect ratio
    skinPreview.style.maxWidth = '128px'; // Never exceed 128px
    skinPreview.style.maxHeight = '128px';
    skinPreview.style.zIndex = 20;
    skinPreview.style.border = '2px solid #333';
    skinPreview.style.background = 'none'; // Allow transparency
    skinPreview.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    skinPreview.style.imageRendering = 'pixelated';
    skinPreview.style.msInterpolationMode = 'nearest-neighbor'; // For older IE
    skinPreview.id = 'skinPreview';
    document.body.appendChild(skinPreview);
});