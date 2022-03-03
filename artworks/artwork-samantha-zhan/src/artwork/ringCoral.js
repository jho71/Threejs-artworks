import * as THREE from "three";
import { MathUtils } from "three";
import Tentacle from "./tentacle.ts";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

export default class RingCoral {
  coralCrowds = [];
  coralRings = [];
  colorSteps = [];
  rings = [];
  insetWidth;
  insetHeight;
  ringMaterial = new THREE.MeshBasicMaterial({
    opacity: 0,
    color: 0x000000,
  });
  coralRingGroup = new THREE.Group();
  ringHeights = [];
  numRings;
  density = 8;
  weight = 5;
  spacing = 5;
  delay = 0;
  blanks = 3;
  tail = 10;
  colorInt = 1;
  constructor(
    insetWidth,
    insetHeight,
    numRings,
    ringHeights,
    density,
    weight,
    spacing,
    delay,
    blanks,
    tail,
    colorInt
  ) {
    this.insetHeight = insetHeight;
    this.insetWidth = insetWidth;
    this.spacing = spacing;
    this.numRings = numRings;
    this.density = density;
    this.weight = weight;
    this.delay = delay;
    this.blanks = blanks;
    this.tail = tail;
    this.colorInt = colorInt;
    this.populateRings(this.numRings * 3);
    this.ringHeights = ringHeights;
    this.coralOnRings();
  }

  coralOnRings() {
    this.rings.forEach((ring, index) => {
      ring.rotation.x = Math.PI / 2;
      this.coralRingGroup.add(ring);
      if (index < this.numRings || index >= this.numRings + this.blanks) {
        ring.rotation.x = Math.PI / 2;
        this.coralRingGroup.add(ring);
        this.coralRingGroup.add(
          this.plantCoral(
            ring.geometry.attributes.position.array,
            index < this.ringHeights.length
              ? this.ringHeights[index]
              : this.ringHeights[this.ringHeights.length - 1],
            this.weight,
            index
          )
        );
      }
    });
  }

  plantCoral(vertices, length, weight, index) {
    var maxHeight = 40;
    const cluster_length = length;
    const colorStep =
      this.colorInt !== 1
        ? Math.random() * this.colorInt + 0.2
        : Math.random() * this.colorInt;
    this.colorSteps.push(colorStep);
    var tentacles = new THREE.Group();
    var material = new LineMaterial({
      dashed: false,
      vertexColors: true,
    });
    var tentObj = [];
    for (let i = 0; i < vertices.length; i += 3 * this.density) {
      const randomX = MathUtils.randFloat(-Math.PI / 2, Math.PI / 2);
      const randomZ = MathUtils.randFloat(-Math.PI / 2, Math.PI / 2);
      var tentacle = new Tentacle(
        randomX,
        randomZ,
        cluster_length,
        colorStep,
        weight,
        (cluster_length / maxHeight) * 2.2,
        material
      );
      tentacle.displayMesh.material.resolution.set(
        this.insetWidth,
        this.insetHeight
      );
      const position = new THREE.Vector3();

      position.x = i;
      position.set(vertices[i], vertices[i + 2], vertices[i + 1]);
      tentacle.group.position.copy(position);

      tentacles.add(tentacle.group);
      tentObj.push(tentacle);
    }
    this.coralCrowds.push(tentObj);
    this.coralRings.push(tentacles);
    tentacles.rotation.y = this.delay * index;
    return tentacles;
  }

  populateRings(numRings) {
    var totalRings = 3;
    while (totalRings <= numRings + (this.blanks + this.tail) * 3) {
      const ringMesh0 = this.getRing(
        this.spacing * totalRings,
        this.spacing * (totalRings + 1),
        this.ringMaterial
      );
      this.rings.push(ringMesh0);
      totalRings += 3;
    }
  }

  getRing(min, max, material) {
    const ring = new THREE.RingGeometry(min, max, 100);
    material.transparent = true;
    const ringMesh = new THREE.Mesh(ring, material);
    return ringMesh;
  }

  lastUpdate = 0;
  floor = 0;
  update(time) {
    for (var index = 0; index < this.coralRings.length; index++) {
      var ring = this.coralRings[index];
      const addedBy = (Math.sin(time + index * 0.15) - 1) * 100;
      if (!isNaN(addedBy)) {
        ring.position.y = addedBy;
      }
      const addedByRot = Math.sin(time + index * 0.5) * 0.3;
      if (!isNaN(addedByRot)) {
        ring.rotation.y = addedByRot;
      }
    }
  }
}
