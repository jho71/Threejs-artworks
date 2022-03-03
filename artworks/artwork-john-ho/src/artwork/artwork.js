import * as THREE from "three";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import React, { useRef, useEffect } from "react";
import Butterfly from "./helpers/butterfly";
import { GUI } from 'dat.gui'
import {splines} from './helpers/splines.js'
import  Curves  from './helpers/extraCurves.js';

const Art = () => {
  const inputEl = useRef(null);

  useEffect(() => {
    
    let BUTTERFLY_COUNT = 10;
    let BUTTERFLY_SIZE = 10;
    let BUTTERFLY_MAX_COUNT = 10;
    let BUTTERFLY_DISPERSE = 0;
    let BUTTERFLY_SPEED = 0.003;
    let yOffset = 0;

    const scene = new THREE.Scene(); 
    const butterflies = [];
    const loader = new THREE.TextureLoader();
    const clock = new THREE.Clock();

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera( 
      70,
      sizes.width / sizes.height,
      1,
      4000
    );
    camera.position.set( -28.971801431511,-100.31505655202412, 300.54653807174375);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.width, sizes.height);
    document.body.appendChild(renderer.domElement);


    const composer = new EffectComposer( renderer );
    const bloomPass = new UnrealBloomPass({x: sizes.width, y: sizes.height}, 0.25, 0.0, 0.75)
    const afterImagePass = new AfterimagePass(.80)


    composer.addPass( new RenderPass(scene, camera))
    composer.addPass(bloomPass)
    composer.addPass(afterImagePass)

    //add controls
    const controls = new OrbitControls(camera, renderer.domElement);
     controls.autoRotate = true;
     controls.autoRotateSpeed = -.5;
     controls.enablePan = false;
    
    //add axes helper
    // const axesHelper = new THREE.AxesHelper(500);
    // scene.add(axesHelper);

    let curveChoice = splines.BaseSpiral

    let hlight = new THREE.AmbientLight (0x404040,7);
    scene.add(hlight);
    let directionalLight = new THREE.DirectionalLight(0xffffff,5);
    directionalLight.position.set(0,1,0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);


    const lineGeometry = new THREE.BufferGeometry().setFromPoints( curveChoice.points );
    const splineObject = new THREE.Line( lineGeometry );
    splineObject.visible = false
    scene.add(splineObject);

    const modelLoader = new GLTFLoader();

    modelLoader.load( './assets/untitled.glb', function ( gltf ) {
      gltf.scene.scale.set(1000,1000,1000)
      gltf.scene.position.set(20,-1490,-160)

      scene.add( gltf.scene );
    })
    modelLoader.load( './assets/spliff.glb', function ( gltf ) {
      gltf.scene.scale.set(.15,.15,.15)
      gltf.scene.position.set(20,-10,-30)
      gltf.scene.rotateY(-90)
      gltf.scene.rotateZ(.1)
      scene.add( gltf.scene );
    })
    // const params = {
    //   spline: 'BaseSpiral',
    //   scale: 1,
    //   quantity: BUTTERFLY_COUNT,
    //   size: BUTTERFLY_SIZE,
    //   dispersion : BUTTERFLY_DISPERSE,
    //   speed : BUTTERFLY_SPEED

    // };
    // let  tubeGeometry, mesh;
    // let extrusionSegments = 100;
    // let radiusSegments = 3;

    // function addTube() {
    //   const extrudePath = splines[ params.spline ];
    //   curveChoice = extrudePath
    //   tubeGeometry = new THREE.TubeGeometry( extrudePath, extrusionSegments, 1, radiusSegments, params.closed );

    //   addGeometry( tubeGeometry );
    //   setScale();
    // }

    // function addGeometry( geometry ) {

    //   mesh = new THREE.Mesh( geometry);
    //   mesh.visible = false
    //   scene.add( mesh );
		// }

    // function setScale() {
    //   splines[params.spline] = new Curves[params.spline](params.scale)
    //   curveChoice = splines[params.spline]
    //   mesh.scale.set( params.scale, params.scale, params.scale);
     
    //   const box = new THREE.Box3().setFromObject(mesh);
    //   const size = new THREE.Vector3();
    //   box.getSize(size);
      
    //   yOffset = size.z / 2;

    //   if(params.spline === 'HelixCurve'){
    //     yOffset = 0;
    //   }
    //   else if(params.spline === 'HeartCurve' || params.spline === 'TrefoilKnot' || params.spline === 'TorusKnot' ||  params.spline === 'CinquefoilKnot' ){
    //     yOffset = size.x / 2
    //   }
    //   else if(params.spline === 'FigureEightPolynomialKnot' || params.spline === 'DecoratedTorusKnot4a' || params.spline === 'DecoratedTorusKnot4b'|| params.spline === 'DecoratedTorusKnot5a'|| params.spline === 'DecoratedTorusKnot5c'){
    //     yOffset = size.y / 2

    //   }
      
    //   mesh.position.y =+ yOffset 

    // }
    //add gridHelper
    // const gridHelper = new THREE.GridHelper(1000, 10); //size, divisions
    // scene.add(gridHelper);


    const render = () => {
      const time = clock.getDelta();
  
      // render 3d objects
      for (var i = 0; i < butterflies.length; i++) {
        butterflies[i].render(renderer, time);
      }
      renderer.render(scene, camera); 
    }

    const updateVisibleButterfly = () => {
      if(butterflies.length){
      for (var i = 0; i < butterflies.length; i++) {   
        butterflies[i].uniforms.opacity.value = 0.0
      }
      for (var j = 0; j < BUTTERFLY_COUNT; j++) {   
        butterflies[j].uniforms.opacity.value = 1.0
      }
    }
    }

    const renderLoop = () => {
      render()
      composer.render();
      window.requestAnimationFrame(renderLoop); // Call tick again on the next frame
      controls.update();

      for (var i = 0; i < butterflies.length; i++) {   
        butterflies[i].uniforms.timer.value += butterflies[i].uniforms.speed.value;  
        var pos = butterflies[i].uniforms.tOffset.value + butterflies[i].uniforms.timer.value;

        butterflies[i].uniforms.size.value = BUTTERFLY_SIZE;

        if(pos >= 1){
          butterflies[i].uniforms.timer.value = 0;
          butterflies[i].uniforms.tOffset.value = 0;
          pos = 0; 
        }
        var point =  curveChoice.getPoint(pos);
    
        var point2 =  curveChoice.getPoint(THREE.MathUtils.clamp(pos + 0.3, 0, 1));
        butterflies[i].obj.position.set(point.x,point.y + yOffset , point.z)
        butterflies[i].obj.lookAt(point2.x, point2.y+ yOffset , point2.z);
      }

      if(camera.position.z < -20 ){
        controls.autoRotateSpeed *= -1;
      }
    

    };

    const init = () => {
    

    const box = new THREE.Box3().setFromObject(splineObject);
    const size = new THREE.Vector3();
    box.getSize(size);

    yOffset = size.y / 2;
    splineObject.position.y = yOffset
    
    controls.target.set(0,90,0);

    loader.load('./assets/tex.png', (texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      // add 3d objects
      for (var i = 0; i < BUTTERFLY_MAX_COUNT; i++) {
        butterflies[i] = new Butterfly(i, texture, BUTTERFLY_SIZE)
        var pos =  curveChoice.getPoint(butterflies[i].uniforms.tOffset.value);
        
         butterflies[i].obj.position.x = pos.x
         butterflies[i].obj.position.y = pos.y
         butterflies[i].obj.position.z = pos.z
        scene.add(butterflies[i].obj);
      }
    })
    updateVisibleButterfly()
    
    scene.background = new THREE.CubeTextureLoader()
    .setPath( './assets/box/')
    .load( [
      '5.png',
      '3.png', 
      '1.png',
      'top.png',
      '4.png',
      '2.png',
    ]);

    // const gui = new GUI( { width: 285 } );

    // const folderGeometry = gui.addFolder( 'Geometry' );
    // folderGeometry.add( params, 'spline', Object.keys( splines ) ).onChange( function () {
    //   addTube();
    // } );
    // folderGeometry.add( params, 'scale', 2, 300 ).step( 2 ).onChange( function () {
    //   setScale();
    // } );

    // const folderButterfly = gui.addFolder( 'Butterfly' );
    // folderButterfly.add( params, 'size' , 5, 40 ).step( 1 ).onChange( function () {
    //   BUTTERFLY_SIZE = params.size;
    // } );
    // folderButterfly.add( params, 'quantity' , 0, 200 ).step( 1 ).onChange( function () {
    //   BUTTERFLY_COUNT = params.quantity;
    //   updateVisibleButterfly()
    // } );
    // folderButterfly.add( params, 'dispersion' , 0, 5 ).step( .1 ).onChange( function () {
    //   BUTTERFLY_DISPERSE = params.dispersion;
    //   updateDispersionButterfly()
    // } );
    // folderButterfly.add( params, 'speed' , .001 ,.005 ).step( .0001 ).onChange( function () {
    //   BUTTERFLY_SPEED = params.speed;
    //   updateSpeedButterfly()
    //   console.log(camera.position, camera.lookAt)
    // } );

    // folderGeometry.open();
    // folderButterfly.open();

    renderLoop();

  function onResize() {    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

    window.addEventListener('resize', onResize);

	}    
  init();
}, []);
  
  return (
    <>
      <div ref={inputEl}></div>
    </>
  );
};

export default Art;
