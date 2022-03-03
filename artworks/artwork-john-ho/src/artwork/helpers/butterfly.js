import { vertexShader, fragmentShader } from './shader.glsl';
import * as THREE from "three";

export default class Butterfly {
  constructor(i, texture, size) {
    this.uniforms = {
      index: {
        type: 'f',
        value: i
      },
      time: {
        type: 'f',
        value: 0
      },
      timer: {
        type: 'f',
        value: 0
      },
      speed: {
        type: 'f',
        value:  Math.random() * ( .0015 - .001) + .001
      },
      size: {
        type: 'f',
        value: size
      },
      texture: {
        type: 't',
        value: texture
      },
      colorH: {
        type: 'f',
        value: Math.random()
      },
      opacity: {
        type: 'f',
        value: 1.0
      },
      tOffset: {
        type: 'f',
        value: Math.random() * (.5 - 0)
      },
      dispersion: {
        type: 'f',
        value: Math.random() * (1.0 - -1.0) + -1.0
      },
      // tDiffuse: { value: 1.0 },
      // luminosityThreshold: { value: 0.0 },
      // smoothWidth: { value: 1.0 },
      // defaultColor: { value: new THREE.Color( 0x000000 ) },
      // defaultOpacity: { value: 1.0 }
    }
    this.obj = this.createObj();
    this.obj.renderOrder = 10;
  }
  createObj() {
    let geometry = new THREE.PlaneGeometry(this.uniforms.size.value, this.uniforms.size.value / 2, 24, 12);

    let mesh = new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: this.uniforms.opacity
      })
    );

    //mesh.add(new THREE.AxesHelper(20));

    mesh.up.set(0, 1, 0)

    return mesh;
  }
  render(renderer, time) {
    this.uniforms.time.value += time;
    this.obj.scale.set( this.uniforms.size.value, this.uniforms.size.value, this.uniforms.size.value);
  }
}