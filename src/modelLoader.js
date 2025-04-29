// Handles loading the Steve model and skin
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadSteveModel(scene, skinMaterial, onLoaded) {
    const SteveLoader = new GLTFLoader();
    SteveLoader.load(
        '/Resources/Models/Steve/scene.gltf',
        function (stevegltf) {
            console.log('Steve model loaded successfully');
            let SteveModel = stevegltf.scene;
            SteveModel.traverse(function (child) {
                if (child.isMesh) {
                    child.material = skinMaterial;
                    child.material.side = THREE.DoubleSide;
                }
            });
            if (scene.children.length !== 1) {
                scene.add(SteveModel);
            }
            if (onLoaded) onLoaded(SteveModel);
        },
        function (SteveLoading) {
            console.log('Steve model ' + (SteveLoading.loaded / SteveLoading.total * 100) + '% loaded');
        },
        function (SteveLoadingError) {
            console.error('Error loading Steve model:', SteveLoadingError);
        }
    );
}

export function createSkinMaterial() {
    const SkinTextureLoader = new THREE.TextureLoader();
    console.log('Attempting to load skin texture from /Resources/Textures/Skin.png');
    const texture = SkinTextureLoader.load(
        '/Resources/Textures/Skin.png',
        function () {
            console.log('Skin texture loaded successfully');
        },
        undefined,
        function (err) {
            console.error('Error loading skin texture:', err);
        }
    );
    texture.transparent = true;
    texture.side = THREE.DoubleSide;
    texture.flipY = false;
    texture.magFilter = THREE.NearestFilter;
    return new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: true,
    });
}
