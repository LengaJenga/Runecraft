import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Color, FlatShading, Texture, TextureLoader } from 'three';

const scene = new THREE.Scene(); //This is the entire 3D scene for three.js

//This is the perspective camera for the three.js scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight); //FOV, aspect ratio, close culling, far culling

const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#bg'),
});

// scene.background = new Color('brown'); //Background Color

//I don't know what this does, but it looks bad without it.
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.outerHeight);

camera.position.setZ(35);

renderer.render(scene, camera);

//!!!TORUS!!!
const TorusGeometry = new THREE.TorusGeometry(10,2,3,30);
const TorusMaterial = new THREE.MeshBasicMaterial({ //Torus's material all some parameters
    color: 0xFF6347,
    wireframe: true,
    // flatShading: true,
});

const TorusMesh = new THREE.Mesh(TorusGeometry, TorusMaterial); //Combining the torus geometry and material info into one package
// scene.add(TorusMesh); //adding the torus, disabled for now since steve is working.



//!!!WIP STEVE!!!
//LOADING CUSTOM STEVE.GLTF

// var SteveTextureLoader = new THREE.TextureLoader();//Defining the texture loader
// var SteveTexture = SteveTextureLoader.load(
//     '/Resources/Textures/Steve.png'); //loading in the steve skin


// var SteveMaterial = new THREE.MeshBasicMaterial({

//     map: SteveTexture,
//     FlatShading: true

// });

//IMPORTING THE STEVE SKIN
var SkinTextureLoader = new THREE.TextureLoader();

var SkinMaterial = new THREE.MeshBasicMaterial({

    map: SkinTextureLoader.load('/Resources/Textures/Steve.png')

});

SkinMaterial.map.flipY = false;
SkinMaterial.map.magFilter = THREE.NearestFilter;
// SkinMaterial.minFilter = THREE.NearestFilter;



//IMPORTING THE STEVE MODEL
var SteveLoader = new GLTFLoader();//Defining the .gltf loader
var SteveModel;
SteveLoader.load('/Resources/Models/Steve/scene.gltf',
    function (stevegltf){

        SteveModel = stevegltf.scene;

        SteveModel.traverse(function (child){
            if (child.isMesh){
                child.material = SkinMaterial;
            }
        });

        SteveModel = stevegltf.scene;
        if(scene.children.length != 1){ //steve and alex are different models but I don't have enough implemented to fix this yet

            scene.add(SteveModel);

        }
    }, //loading 
    function (SteveLoading){

        console.log(('Steve model ' + SteveLoading.loaded / SteveLoading.total * 100) + '% loaded');

    }, //errors
    function (SteveLoadingError){

        console.log('oops something is broken when loading steve :( ' + SteveLoadingError.error);

    });

//CUSTOM STEVE TEXTURE
//TO DO STEVE TEXTURE
// https://stackoverflow.com/questions/56660584/how-to-override-gltf-materials-in-three-js
// https://threejs.org/docs/?q=isMesh#api/en/core/Object3D.traverse 
// https://stackoverflow.com/questions/52236033/how-to-dynamically-overlay-a-texture-from-a-gltf-model-three-js
// https://threejs.org/docs/#examples/en/loaders/GLTFLoader
// https://jsfiddle.net/vcx5e4g6/
// https://discourse.threejs.org/t/changing-material-s-of-a-mesh-in-runtime/10122
// https://threejs.org/docs/#api/en/loaders/ObjectLoader
// https://www.youtube.com/watch?v=Q7AOvWpIVHU&t=214s

//This is the function I can call later that redraws the scene/page, as well as anything else I want.
function AnimateScene(){
    requestAnimationFrame(AnimateScene);
    //Do stuff past here!!

    // TorusMesh.rotation.y += 0.003;
    SteveModel.rotation.y += 0.005;

    //Stop doing stuff past here!!
    renderer.render(scene,camera); //except this, this is ok
}

AnimateScene(); //This calls the animate scene function for the scene to reload "a lot"