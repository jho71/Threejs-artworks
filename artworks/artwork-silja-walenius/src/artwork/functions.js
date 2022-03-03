import GUI from "lil-gui";
import { maxParticles, params } from './constants'

const initGUI = ({ boundingBox, pointCloud, linesShape}, particles, waterMaterial, groundPlane, camera, starMaterial, unrealBloomPass) => {
  // Debug
  const gui = new GUI();
  gui.add(camera.position, "x", 0, 20, 0.001).name("cameraX");
  gui.add(camera.position, "y", 0, 20, 0.001).name("cameraY");
  gui.add(camera.position, "z", 0, 40, 0.001).name("cameraZ");
  gui.add(params, 'camSpeed', 0, 1, 0.001)



  const starControls = gui.addFolder('stars')

  starControls.add(starMaterial.uniforms.uSparkleSpeed, 'value', 0 , 10.0, 0.01).name('starSparkleSpeed')
  starControls.add(starMaterial.uniforms.uStarSize, 'value', 0 , 40.0, 0.01).name('starsize')
  starControls.add(starMaterial.uniforms.uAlpha, 'value', 0 , 1.0, 0.01).name('alpha')
  starControls.add(params.starSpeed, 'x', 0, 0.5, 0.001).name('speedX');
  starControls.add(params.starSpeed, 'y', 0, 0.5, 0.001).name('speedY');
  starControls.add(params, 'starLimit', 0, 1000, 1).name('starNum');


  const postControls = gui.addFolder('post processing controls ')
  // postControls.add(filmPass, "noiseIntensity", 0, 1, 0.001);
  // postControls.add(filmPass, "enabled");
  // postControls.add(filmPass, "scanlinesIntensity", 0, 1, 0.001);
  // postControls.add(filmPass, "scanlinesCount", 0, 5000, 1);

  postControls.add(unrealBloomPass, 'enabled')
postControls.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001).name('bloomStrength')
postControls.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001).name('bloomRadius')
postControls.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001).name('bloomThreshold')



  gui.add(params, "maxDistance", 0.5, 4, 0.002);
 
  gui.add(params, "limitConnections"); //true or false
  gui.add(params, "maxConnections", 0, 100, 1); //limit connections

  gui.add(linesShape.material, "opacity", 0, 1, 0.001).name("linesOpacity");

  gui.add(params, 'radius', 200, 600, 1)


  const shapeControls = gui.addFolder('shape controls')
  shapeControls.add(params, "particleSpeed", 0, 4, 0.001);
  shapeControls.add(params, "numParticles", 0, maxParticles, 1)
  .onFinishChange((value) => {
      if (particles){ //avoids error of "no particles"
          particles.setDrawRange(0, value);
      }
  })
  shapeControls.add(pointCloud.material, "size", 0, 10, 0.001).name("pointSize");


  // const breathControls = gui.addFolder('breath controls')
  // breathControls.add(params,'inhaleLength', 0, 10, 0.5)
  // breathControls.add(params,'exhaleLength', 0, 10, 0.5)
  // breathControls.add(params,'holdLength', 0, 10, 0.5)

  gui.add(groundPlane.position, 'y', -10, 5, 0.01).name('groundplanePosition')

  const groundPlaneControls = gui.addFolder('ground plane')
  groundPlaneControls.add(waterMaterial.uniforms.uWavesElevation, 'value', 0, 0.5, 0.001).name('elevation')
groundPlaneControls.add(waterMaterial.uniforms.uWavesSpeed, 'value', 0, 4, 0.001).name('speed')
groundPlaneControls.add(waterMaterial.uniforms.uWavesFrequency.value, 'x', 0, 20, 0.001).name('xFrequency')
groundPlaneControls.add(waterMaterial.uniforms.uWavesFrequency.value, 'y', 0, 20, 0.001).name('zFrequency')
groundPlaneControls.add(waterMaterial.uniforms.uColorOffset, 'value', 0, 1, 0.001).name('colorOffset')
groundPlaneControls.add(waterMaterial.uniforms.uColorMultiplier, 'value', 0, 20, 0.001).name('colorMultiplier')
groundPlaneControls.add(waterMaterial.uniforms.uSmallHeight, 'value', 0, 0.5, 0.001).name('smallWaveHeight')



};

export default initGUI; 