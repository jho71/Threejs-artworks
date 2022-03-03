import * as THREE from "three";
import normal from "./texture/water/normal.jpg";
import height from "./texture/water/height.png";
import ambientOcclusion from "./texture/water/ambientOcclusion.jpg";
import color from "./texture/water/color.jpg";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Jelly from "./jelly";

const Artwork = () => {
  const inputEl = useRef(null);
  useEffect(() => {
    var scene;
    var clock;
    var camera;
    var renderer;
    var controls;
    var delta = 0;
    var insetWidth = window.innerHeight / 4; // square
    var insetHeight = window.innerHeight / 4;

    function init() {
      scene = new THREE.Scene();
      clock = new THREE.Clock();

      var enableFog = false;

      if (enableFog) {
        scene.fog = new THREE.FogExp2(0xffffff, 0.2);
      }

      var pointLight = getPointLight(1);
      var sphere = getSphere(0.05);
      pointLight.position.y = 10;
      pointLight.intensity = 2;

      pointLight.add(sphere);
      scene.add(pointLight);

      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        20000
      );

      camera.position.x = 8119;
      camera.position.y = 613;
      camera.position.z = 4298;
      camera.lookAt(new THREE.Vector3(0, -2000, 0));

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000);
      inputEl.current.appendChild(renderer.domElement);
      renderer.setPixelRatio(window.devicePixelRatio);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.maxDistance = 9000;
      // controls.enablePan = false;
      controls.minDistance = 3500;

      var minPan = new THREE.Vector3(-1000, -1000, -1000);
      var maxPan = new THREE.Vector3(1000, 1000, 1000);
      var _v = new THREE.Vector3();

      controls.addEventListener("change", function () {
        _v.copy(controls.target);
        controls.target.clamp(minPan, maxPan);
        _v.sub(controls.target);
        camera.position.sub(_v);
      });

      /*       const axesHelper = new THREE.AxesHelper(500);
      scene.add(axesHelper); */
      //add gridHelper
      // const gridHelper = new THREE.GridHelper(1000, 10); //size, divisions
      // scene.add(gridHelper);

      window.addEventListener("resize", onWindowResize);
      onWindowResize();

      scene.add(new THREE.AmbientLight(0xffffff, 0.86));
      var dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(0, 10, 10);
    }
    init();

    const waterMaterial = new THREE.MeshStandardMaterial();
    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(8000, 64, 64),
      waterMaterial
    );
    loadTextures(sphere);
    sphere.rotation.x = Math.PI / 2;
    scene.add(sphere);

    const jellys = [];
    const jellysGroup = new THREE.Group();
    const jelly1 = new Jelly(
      insetWidth,
      insetHeight,
      100,
      10,
      3,
      10,
      2000,
      20,
      50,
      40,
      0.4
    );
    jelly1.jellyGroup.rotation.x = Math.PI / 8;
    jellysGroup.add(jelly1.jellyGroup);
    jellys.push(jelly1);
    const jelly2 = new Jelly(
      insetWidth,
      insetHeight,
      50,
      5,
      2,
      5,
      1500,
      10,
      40,
      50,
      1
    );
    jelly2.jellyGroup.position.x = -681;
    jelly2.jellyGroup.position.z = 1075;
    jelly2.jellyGroup.position.y = -1700;
    jelly2.jellyGroup.rotation.x = Math.PI / 8;
    jellysGroup.add(jelly2.jellyGroup);
    jellys.push(jelly2);

    const jelly3 = new Jelly(
      insetWidth,
      insetHeight,
      50,
      3,
      1,
      3,
      1000,
      10,
      40,
      40,
      1
    );
    jelly3.jellyGroup.position.x = 913;
    jelly3.jellyGroup.position.z = -1794;
    jelly3.jellyGroup.position.y = -1400;
    jelly3.jellyGroup.rotation.x = Math.PI / 8;
    jellysGroup.add(jelly3.jellyGroup);
    jellys.push(jelly3);

    scene.add(jellysGroup);

    function loadTextures(shape) {
      const textureLoader = new THREE.TextureLoader();
      const watercolorTexture = textureLoader.load(color);
      const waterambientOcclusionTexture = textureLoader.load(ambientOcclusion);
      const waterheightTexture = textureLoader.load(height);
      const waternormalTexture = textureLoader.load(normal);
      shape.geometry.setAttribute(
        "uv2",
        new THREE.BufferAttribute(shape.geometry.attributes.uv.array, 2)
      );
      shape.material.map = watercolorTexture;
      shape.material.side = THREE.BackSide;
      shape.material.aoMap = waterambientOcclusionTexture;
      shape.material.aoMapIntensity = 1;
      shape.material.displacementMap = waterheightTexture;
      shape.material.displacementScale = 5;
      shape.material.normalMap = waternormalTexture;
      shape.material.normalScale.set(2, 2);
      shape.material.roughness = 0.9;
      shape.material.color = new THREE.Color(0x00223d);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

      insetWidth = window.innerHeight / 4; // square
      insetHeight = window.innerHeight / 4;
    }

    sphere.rotation.z = Math.PI / 8;
    sphere.position.x = 1000;
    jellysGroup.rotation.y = -Math.PI / 8;
    jellysGroup.position.y = 5000;
    var time = 0;
    function animate() {
      requestAnimationFrame(animate);
      delta = clock.getDelta();
      time += delta;

      sphere.rotation.y = time * 0.08;

      jellysGroup.position.y = Math.sin(time) * 100;

      for (var i = 0; i < jellys.length; i++) {
        jellys[i].update(time, delta);
      }

      render(delta);
    }
    animate();

    function render(delta) {
      controls.update(delta);
      renderer.render(scene, camera);
    }

    function getPointLight(intensity) {
      var light = new THREE.PointLight(0xffffff, intensity);
      return light;
    }

    function getSphere(size) {
      var geometry = new THREE.SphereGeometry(size, 24, 24);
      var material = new THREE.MeshBasicMaterial({
        color: "rgb(255, 255, 255)",
      });
      var mesh = new THREE.Mesh(geometry, material);

      return mesh;
    }
  }, []);

  return (
    <>
      <div ref={inputEl}></div>
    </>
  );
};
export default Artwork;
