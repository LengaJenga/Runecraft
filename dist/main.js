import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three';
import { Color, FlatShading, Texture, TextureLoader } from 'three';
import { OrbitControls } from 'three';

const scene = new THREE.Scene(); //This is the entire 3D scene for three.js

//This is the perspective camera for the three.js scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //FOV, aspect ratio, close culling, far culling (aspect ratio changes later)

const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
});

// scene.background = new Color('brown'); //Background Color

//I don't know what this does, but it looks bad without it.
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.outerHeight);

camera.position.setZ(35); //The number is the distance on the 'Z' axis.

//Orbit camera
const OrbitCamera = new OrbitControls(camera, renderer.domElement);

renderer.render(scene, camera); //This makes the render go :)

// //Automatic window resize, it doesn't seem to work/do what I want at the moment
// window.addEventListener('resize', onWindowResize, false);
// function onWindowResize(){

//     camera.aspect = (window.innerWidth / window.innerHeight);
//     camera.updateProjectionMatrix;


//     renderer.setSize(window.innerWidth, window.outerHeight);

// }

//IMPORTING THE STEVE SKIN
var SkinTextureLoader = new THREE.TextureLoader();

var SkinMaterial = new THREE.MeshBasicMaterial({

    map: SkinTextureLoader.load('dist/skin.png'),
    transparent: true,
    alphaTest: true,

});

SkinMaterial.map.transparent = true;
SkinMaterial.map.side = THREE.DoubleSide;
SkinMaterial.map.flipY = false;
SkinMaterial.map.magFilter = THREE.NearestFilter;
// SkinMaterial.minFilter = THREE.NearestFilter; //This is commented out as it doesn't seem needed yet/ever

//IMPORTING THE STEVE MODEL
var SteveLoader = new GLTFLoader();//Defining the .gltf loader
var SteveModel;
SteveLoader.load('dist/scene.gltf',
    function (stevegltf){

        SteveModel = stevegltf.scene;

        SteveModel.traverse(function (child){
            if (child.isMesh){
                child.material = SkinMaterial;
                child.material.side = THREE.DoubleSide; //This makes the transparent bits double sided
            }
        });

        SteveModel = stevegltf.scene;
        if(scene.children.length != 1){ //steve and alex are different models but I don't have enough implemented to fix this check yet

            scene.add(SteveModel); //adds the steve model to the scene

        }
    }, //loading output
    function (SteveLoading){

        console.log(('Steve model ' + SteveLoading.loaded / SteveLoading.total * 100) + '% loaded');

    }, //errors output
    function (SteveLoadingError){

        console.log('oops something is broken when loading steve :( ' + SteveLoadingError.error);

    });

//This is the function I can call later that redraws the scene/page, as well as anything else I want.
function AnimateScene(){
    requestAnimationFrame(AnimateScene);
    //Do stuff past here!!
    // SteveModel.rotation.y += 0.005;

    OrbitCamera.update();

    //Stop doing stuff past here!!
    renderer.render(scene,camera); //except this, this is ok
}

AnimateScene(); //This calls the animate scene function for the scene to reload "a lot"