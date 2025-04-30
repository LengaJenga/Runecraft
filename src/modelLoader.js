// Handles loading the Steve model and skin
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadSteveModel(scene, skinMaterial, onLoaded) {
    const SteveLoader = new GLTFLoader();
    SteveLoader.load(
        'Resources/Models/Steve/scene.gltf',
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
        undefined,
        function (SteveLoadingError) {
            console.error('Error loading Steve model:', SteveLoadingError);
        }
    );
}

let lastSkinTexture = null;

export function createSkinMaterial() {
    const SkinTextureLoader = new THREE.TextureLoader();
    console.log('Attempting to load skin texture...');
    const texture = SkinTextureLoader.load('Resources/Textures/Parts/Misc/template.png',
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
    lastSkinTexture = texture;
    return new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: true,
    });
}

/**
 * Updates the skin texture with a new image source (data URL).
 * Call this after assembling a new skin.
 * @param {string} dataUrl - The new skin image as a data URL.
 */
export function updateSkinTextureFromDataUrl(dataUrl) {
    if (!lastSkinTexture) {
        console.warn('No skin texture to update.');
        return;
    }
    const img = new window.Image();
    img.onload = function() {
        // Ensure the texture's image is updated and the size matches
        lastSkinTexture.image = img;
        lastSkinTexture.needsUpdate = true;
        lastSkinTexture.flipY = false;
        // If the material is not updating, force update on all materials using this texture
        if (lastSkinTexture.onUpdate) lastSkinTexture.onUpdate();
        // If you have a mesh/material reference, you may need to call material.needsUpdate = true as well
        console.log('Skin texture updated from data URL');
    };
    img.onerror = function(e) {
        console.error('Failed to load skin image from data URL', e);
    };
    img.crossOrigin = 'anonymous'; // In case you use data URLs from other sources
    img.src = dataUrl;
}
