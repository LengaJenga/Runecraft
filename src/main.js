import { createRenderer, createScene } from './canvas.js';
import { createCamera, createOrbitControls } from './camera.js';
import { createSkinMaterial, loadSteveModel } from './modelLoader.js';

const scene = createScene();
const renderer = createRenderer();
const camera = createCamera();
const OrbitCamera = createOrbitControls(camera, renderer);

renderer.render(scene, camera);

const skinMaterial = createSkinMaterial();
let SteveModel = null;

loadSteveModel(scene, skinMaterial, (model) => {
    SteveModel = model;
});

function AnimateScene() {
    requestAnimationFrame(AnimateScene);
    if (SteveModel) {
        // SteveModel.rotation.y += 0.005; // Rotate the model around its Y-axis
    }
    OrbitCamera.update();
    renderer.render(scene, camera);
}

AnimateScene();