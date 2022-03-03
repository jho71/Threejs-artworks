import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import React, { useRef, useEffect, useCallback } from "react";
import { params, maxParticles } from "./constants";
// import initGUI from "./functions";
import { gsap } from "gsap";
import {
  sphereVertexShader,
  sphereFragmentShader,
} from "./shader/sphere/shader.glsl.js";
import { vertexShader, fragmentShader } from "./shader/plane/shaders.glsl.js";
import {
  starVertexShader,
  starFragmentShader,
} from "./shader/stars/shader.glsl.js";
 import Stats from "three/examples/jsm/libs/stats.module";
import { MathUtils} from "three";
import particleTexture from "../static/particle.png"

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";

const Art = ({ inhaleLength, exhaleLength, holdLength }) => {
  const inputEl = useRef(null);
  const webglRef = useRef(null);
  const curPhaseRef = useRef(null);

  const inhale = (length, object) => {
    gsap.to(object.scale, {
      x: 2,
      y: 2,
      z: 2,
      duration: length,
      ease: "power1.inOut",
    });
  };

  const exhale = (length, object) => {
    gsap.to(object.scale, {
      x: 0.5,
      y: 0.5,
      z: 0.5,
      duration: length,
      ease: "power1.inOut",
    });
  };

  const animateText = useCallback((phaseText, curPhase, phaseTime) => {
    const phases = ["hold...", "inhale...", "hold...", "exhale..."];
    phaseText.innerHTML = phases[curPhase];

    let duration = 1.2;
    let delayTime = phaseTime - 2 * duration;
    if (phaseTime < duration * 2) {
      duration = phaseTime / 2;
      delayTime = phaseTime / 2;
    }

    gsap.fromTo(
      phaseText,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 0.8,
        scale: 1,
        duration: duration,
      }
    );
    gsap.to(phaseText, {
      opacity: 0,
      scale: 0.95,
      duration: duration,
      delay: delayTime,
    });
  }, []);


  const tick = useCallback(
    (rafEl) => {
      const {
        camGroup,
        composer,
        controls,
        clock,
        phase1,
        phase2,
        phase3,
        phase4,
        particlesData,
        particlePositions,
        group,
        linesShape,
        pointCloud,
        sceneSphere,
        starMaterial,
        groundPlaneMaterial,
        positions,
        colors,
        starPositions,
        starsRandomMotion,
        stars,
        stats,
        phaseText,
      } = webglRef.current;
      let { lastElapsedTime, countTime, timelineRan } = webglRef.current;
      let { curPhase1, curPhase2, curPhase3, curPhase4 } = curPhaseRef.current;

      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - lastElapsedTime;

      webglRef.current.lastElapsedTime = elapsedTime;

      controls.update();

      //rotate camera
      camGroup.rotation.y -= deltaTime * params.camSpeed;

      //move atmosphere stars slightly on each tick()
      for (let i = 0; i < params.starCount; i++) {
        const i3 = i * 3;
        starPositions[i3] +=
          Math.cos(elapsedTime * 0.7) *
          params.starSpeed.x *
          starsRandomMotion[i];
        starPositions[i3 + 1] +=
          Math.sin(elapsedTime * 0.7) *
          params.starSpeed.y *
          starsRandomMotion[i];
      }

      let vertexpos = 0; //initially, no lines are rendered
      let colorpos = 0;
      let lineConnections = 0; //initially, zero points connected

      for (let i = 0; i < params.numParticles; i++) {
        particlesData[i].numConnections = 0; //reset number of connections to each particle to 0
        const i3 = i * 3;
        const particleData = particlesData[i]; //save particle data of current particle

        particlePositions[i3] += particleData.velocity.x * params.particleSpeed; //move the particle in x
        particlePositions[i3 + 1] +=
          particleData.velocity.y * params.particleSpeed; //move in y
        particlePositions[i3 + 2] +=
          particleData.velocity.z * params.particleSpeed; // move in z

        const r = params.radius;
        const x = particlePositions[i3];
        const y = particlePositions[i3 + 1];
        const z = particlePositions[i3 + 2];

        const distFromOrigin = Math.sqrt(x * x + y * y + z * z); //find particle distance from origin

        if (distFromOrigin >= r) {
          //if point hits sphere boundary, reverse it
          particleData.velocity.x *= -1;
          particleData.velocity.y *= -1;
          particleData.velocity.z *= -1;
        }

        const connectionsUnderLimit =
          params.limitConnections &&
          particleData.numConnections < params.maxConnections;

        //if the current # of connectioons is under specified limit (gui) ONLY THEN add a new connection

        if (connectionsUnderLimit || !params.limitConnections) {
          for (let j = i + 1; j < params.numParticles; j++) {
            //every particle before i has already been checked
            const secondParticleData = particlesData[j];

            const secondConnectionsUnderLimit =
              params.limitConnections &&
              secondParticleData.numConnections < params.maxConnections;

            if (secondConnectionsUnderLimit || !params.limitConnections) {
              const j3 = j * 3;
              const distX = particlePositions[i3] - particlePositions[j3];
              const distY =
                particlePositions[i3 + 1] - particlePositions[j3 + 1];
              const distZ =
                particlePositions[i3 + 2] - particlePositions[j3 + 2];

              const totalDist = Math.sqrt(
                distX * distX + distY * distY + distZ * distZ
              ); //calculate distance between points

              if (totalDist < params.maxDistance) {
                //if dist is less than the min distance needed
                particleData.numConnections++; //add a connection to first particle
                secondParticleData.numConnections++; //if particles are close enough to be connected, connect them

                //set alpha based on distance
                const alpha = 1.0 - totalDist / params.maxDistance;

                //update line positions
                //add co-ords of first point to positionns array
                positions[vertexpos++] = particlePositions[i3]; //x position
                positions[vertexpos++] = particlePositions[i3 + 1]; //y
                positions[vertexpos++] = particlePositions[i3 + 2]; //z

                //add co-ords of second point to positionns array
                positions[vertexpos++] = particlePositions[j3]; //x2
                positions[vertexpos++] = particlePositions[j3 + 1]; //y2
                positions[vertexpos++] = particlePositions[j3 + 2]; //z2

                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;

                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;

                lineConnections++; //update number of connections total within this frame
              }
            }
          }
        }
      }

      if (countTime === 0) {
        //only get new phase times ONCE per breath cycle
        curPhaseRef.current.curPhase1 = phase1;
        curPhaseRef.current.curPhase2 = phase2;
        curPhaseRef.current.curPhase3 = phase3;
        curPhaseRef.current.curPhase4 = phase4;
      }

      if (curPhase1 && curPhase2 && curPhase3 && curPhase4) {
        //only start this if all phases are defined
        if (countTime < curPhase1) {
          if (timelineRan) {
            animateText(phaseText, 0, curPhase1);
            webglRef.current.timelineRan = false;
          }
        } else if (curPhase1 <= countTime && countTime <= curPhase2) {
          if (!timelineRan) {
            const phaseTime = curPhase2 - curPhase1;
            inhale(phaseTime, group);
            animateText(phaseText, 1, phaseTime);
            webglRef.current.timelineRan = true;
          }
        } else if (curPhase2 < countTime && countTime < curPhase3) {
          if (timelineRan) {
            const phaseTime = curPhase3 - curPhase2;
            animateText(phaseText, 2, phaseTime);
            webglRef.current.timelineRan = false;
          }
        } else if (curPhase3 <= countTime && countTime <= curPhase4) {
          if (!timelineRan) {
            const phaseTime = curPhase4 - curPhase3;
            animateText(phaseText, 3, phaseTime);
            exhale(phaseTime, group);
            webglRef.current.timelineRan = true;
          }
        }
      }

      webglRef.current.countTime += deltaTime;

      //reset count time when breath cycle ends
      if (countTime >= curPhase4) {
        webglRef.current.countTime = 0;
      }

      stars.geometry.attributes.position.needsUpdate = true;
      stars.geometry.setDrawRange(0, params.starLimit);
      linesShape.geometry.setDrawRange(0, 2 * lineConnections);
      linesShape.geometry.attributes.position.needsUpdate = true;
      linesShape.geometry.attributes.color.needsUpdate = true;
      pointCloud.geometry.attributes.position.needsUpdate = true;

      //rotate whole shape slowly
      group.rotation.y += deltaTime * 0.1;

      //update stats
      stats.update();

      //UPDATE GRADIENT MATERIAL TIME
      sceneSphere.material.uniforms.time.value = elapsedTime;
      groundPlaneMaterial.uniforms.time.value = elapsedTime;
      starMaterial.uniforms.uTime.value = elapsedTime;
      //renderer.render(scene, camera); //render

      composer.render(); //render with effectcomposer

      rafEl = window.requestAnimationFrame(tick); // Call tick again on the next frame
    },
    [animateText]
  );


  //INIT SCEN
  useEffect(() => {

    const scene = new THREE.Scene(); //init scene

    const stats = Stats();
    //document.body.appendChild(stats.dom);

    const sizes = {
      //store screen size
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const loadScreen = document.getElementById('loadingScreen')
    const loadCircle = document.getElementById('loadCircle')

    // LOADER SCREEN
    const loadingManager = new THREE.LoadingManager(
      //Loaded
      () =>{

        gsap.to(loadCircle, {
          animation: 'none',
          y: 40,
          scale: 0,
          opacity: 0,
          duration: 2,
          delay: 3,
          ease: "power1.out",
        })
        
        gsap.to(loadScreen, {
          opacity: 0,
          autoAlpha: 0,
          duration: 2,
          delay: 4.5,
          ease: "power1.out",
        })

        gsap.set(loadCircle, {
          autoAlpha: 0,
          delay: 5
        })
      }
    )


    const camera = new THREE.PerspectiveCamera( //add dev camera
      45,
      sizes.width / sizes.height,
      0.1,
      800
    );
    camera.position.set(10, 2.4, 28);
    camera.lookAt(0, 0, 0);


    const camGroup = new THREE.Group();
    camGroup.add(camera);
    scene.add(camGroup);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
   // renderer.setClearColor(new THREE.Color(0xff0000));
    renderer.setClearColor(new THREE.Color(0xfc9797));
    document.body.appendChild(renderer.domElement);

    //add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxDistance = 48;
    controls.enablePan = false;
    controls.enableDamping = true;

    const resizeFn = () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      composer.setSize(sizes.width, sizes.height);
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", resizeFn);


    let RenderTargetClass = null
    if(renderer.getPixelRatio() ===1 && renderer.capabilities.isWebGL2){
      RenderTargetClass = THREE.WebGLMultisampleRenderTarget
    }
    else {
      RenderTargetClass  = THREE.WebGLRenderTarget
    }

   const renderTarget = new RenderTargetClass( //add antialiasing
      800, //this will be resizes on setSize
      600,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );

    
    const composer = new EffectComposer(renderer, renderTarget);
    composer.setSize(sizes.width, sizes.height);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if(renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2){
      const smaaPass = new SMAAPass();
      composer.addPass(smaaPass);
    }

    const renderPass = new RenderPass(scene, camera); //necessary to render the scene
    composer.addPass(renderPass);

    const unrealBloomPass = new UnrealBloomPass();
    composer.addPass(unrealBloomPass)
    unrealBloomPass.strength = 0.38
    unrealBloomPass.radius = 0.5
    unrealBloomPass.threshold = 0.9

    //add axes helper
    // const axesHelper = new THREE.AxesHelper(20);
    //scene.add(axesHelper);

    // //add gridHelper
    // const gridHelper = new THREE.GridHelper(50, 20); //size, divisions
    //scene.add(gridHelper);

    //load textures
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const pointTexture = textureLoader.load(particleTexture);

    const group = new THREE.Group();
    group.renderOrder = 1;
    scene.add(group);

    // Shader Bg Material
    const sceneSphereMaterial = new THREE.ShaderMaterial({
      precision: "lowp",
      uniforms: {
        time: { value: 1.0 },
      },
      vertexShader: sphereVertexShader,
      fragmentShader: sphereFragmentShader,
      side: THREE.DoubleSide,
      transparent: false
    });

    const sceneSphere = new THREE.Mesh(
      new THREE.SphereGeometry(50, 80, 80),
      sceneSphereMaterial
    );
    sceneSphere.rotation.y = Math.PI / 2;

    const groundPlaneMaterial = new THREE.ShaderMaterial({
      precision: "highp",
      uniforms: {
        uWavesElevation: { value: 0.017 },
        uWavesFrequency: { value: new THREE.Vector2(17, 18) },
        time: { value: 1.0 },
        uWavesSpeed: { value: 0.35 },
        uDepthColor: { value: new THREE.Color(0xfc9797) },
        uSurfaceColor: { value: new THREE.Color(0xfcd497) },
        uColorOffset: { value: 0.275 },
        uColorMultiplier: { value: 10.5 },
        uSmallHeight: { value: 0.077 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      //depthWrite: false,
      alphaTest: 0.5
    });

    const groundPlaneGeometry = new THREE.PlaneGeometry(95, 95, 256, 256);
    const groundPlane = new THREE.Mesh(
      groundPlaneGeometry,
      groundPlaneMaterial
    );
    groundPlane.position.y = -7.8;
    groundPlane.rotation.x = Math.PI / -2;
    groundPlane.renderOrder=1 

    sceneSphere.renderOrder = 2;
    scene.add(sceneSphere);
    scene.add(groundPlane);



    //STAR PARTICLES
    const starPositions = new Float32Array(params.starCount * 3);
    const shaderNums = new Float32Array(params.starCount);
    const starsRandomMotion = new Float32Array(params.starCount);

    for (let i = 0; i < params.starCount; i++) {
      const i3 = i * 3;
      starPositions[i3 + 0] = MathUtils.randFloat(-60, 60);
      starPositions[i3 + 1] = MathUtils.randFloat(-60, 60);
      starPositions[i3 + 2] = MathUtils.randFloat(-60, 60);

      shaderNums[i] = MathUtils.randFloat(-10, 10); //generate random num so stars blink at different times
      starsRandomMotion[i] = MathUtils.randFloat(-1, 1); //generate a random value to use for star motion
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );

    const starMaterial = new THREE.ShaderMaterial({
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      uniforms: {
        uTime: { value: 1.0 },
        uParticleMap: { value: pointTexture },
        uSparkleSpeed: { value: 0.5 },
        uStarSize: { value: 20.0 },
        uAlpha: { value: 0.2 },
      },
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    starGeometry.setAttribute(
      "aPhase",
      new THREE.BufferAttribute(shaderNums, 1)
    );

    const testSphere = new THREE.Mesh(
      new THREE.SphereGeometry(params.radius, 32, 16),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.01,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      })
    );
    group.add(testSphere); //adding a sphere to give more of a rounded shape

    const segments = maxParticles * maxParticles;
    const positions = new Float32Array(segments * 3); //one position for each triangle corner - this is for the line geometry
    const colors = new Float32Array(segments * 3); //save line colors / opacities
    const particlePositions = new Float32Array(maxParticles * 3); // set a position to each particle - for points
    const particlesData = [];

    const particles = new THREE.BufferGeometry();

    //populate particles array
    for (let i = 0; i < maxParticles; i++) {
      const i3 = i * 3;
      const randVal = Math.random();
      const r = params.radius;
      const xPos = Math.sin(randVal * 2 * Math.PI) * r * Math.random();
      const zPos = Math.cos(randVal * 2 * Math.PI) * r * Math.random();
      const isPos = Math.random() > 0.5 ? 1 : -1;
      const yPos =
        Math.sqrt(Math.pow(r, 2) - Math.pow(xPos, 2) - Math.pow(zPos, 2)) *
        isPos *
        Math.random();

      particlePositions[i3] = xPos; //x
      particlePositions[i3 + 1] = yPos; //y
      particlePositions[i3 + 2] = zPos; //z

      // add data to data array
      particlesData.push({
        velocity: new THREE.Vector3(
          MathUtils.randFloat(-1, 1),
          MathUtils.randFloat(-1, 1),
          MathUtils.randFloat(-1, 1)
        ),
        numConnections: 0, //each particle starts with no connections
      });
    }

    //create points geometry
    const pointMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 7,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: false,
      alphaMap: pointTexture,
      depthWrite: false,
      depthTest: false,
    });

    particles.setDrawRange(0, params.numParticles); //only display the selected amount of particles

    particles.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3).setUsage(
        THREE.DynamicDrawUsage
      )
    ); //set attribute usage for slight performance improvement
    const pointCloud = new THREE.Points(particles, pointMaterial);

    group.add(pointCloud);

    //now create lines geometry
    const linesGeometry = new THREE.BufferGeometry();

    linesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
    ); //set position attribute
    linesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage)
    ); //set color attribute

    linesGeometry.setDrawRange(0, 0); //init at a draw range of 0 , so no lines show up

    const thinLinesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 5,
      opacity: params.lineOpacity,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const linesShape = new THREE.Line(linesGeometry, thinLinesMaterial);
    linesShape.computeLineDistances();
    group.add(linesShape);

    const phaseText = document.getElementById("phaseText");

    // initGUI(
    //   { pointCloud, linesShape },
    //   particles,
    //   groundPlaneMaterial,
    //   groundPlane,
    //   camera,
    //   starMaterial,
    //   unrealBloomPass
    // );

    /**
     * Animate
     */

    const clock = new THREE.Clock();
    let lastElapsedTime = 0;
    let countTime = 0;
    let timelineRan = true;
    let phase1, phase2, phase3, phase4, inhaleTime, exhaleTime;
    let rafEl;
    let curPhase1 = 0;
    let curPhase2 = 0;
    let curPhase3 = 0;
    let curPhase4 = 0;

    webglRef.current = {
      scene,
      camera,
      camGroup,
      renderer,
      composer,
      phase1,
      phase2,
      phase3,
      phase4,
      inhaleTime,
      exhaleTime,
      controls,
      clock,
      particlesData,
      particlePositions,
      group,
      linesShape,
      pointCloud,
      sceneSphere,
      groundPlaneMaterial,
      starMaterial,
      positions,
      colors,
      lastElapsedTime,
      countTime,
      timelineRan,
      starPositions,
      starsRandomMotion,
      stars,
      stats,
      phaseText,
    }; //store all webGL objects
    curPhaseRef.current = { curPhase1, curPhase2, curPhase3, curPhase4 }; //store elements for shape motion

    tick(rafEl);

    return () => {
      rafEl && window.cancelAnimationFrame(tick);
      window.removeEventListener("resize", resizeFn)
    };
  }, [tick]);

  //handle state change here
  useEffect(() => {
    webglRef.current.phase1 = holdLength;
    webglRef.current.phase2 = inhaleLength + holdLength;
    webglRef.current.phase3 = inhaleLength + holdLength + holdLength;
    webglRef.current.phase4 =
      inhaleLength + holdLength + exhaleLength + holdLength;

    webglRef.current.inhaleTime = inhaleLength;
    webglRef.current.exhaleTime = exhaleLength;
  }, [inhaleLength, exhaleLength, holdLength]);

  return (
    <>
      <div ref={inputEl}></div>
    </>
  );
};

export default Art;
