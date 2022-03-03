import * as THREE from "three";
import { MathUtils } from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import RingCoral from "./ringCoral";
import Tentacle from "./tentacle.ts";

export default class Jelly {
  insetWidth;
  insetHeight;
  jellyGroup = new THREE.Group();
  coralCrowds = [];
  capAddedHeight = 0;
  numRings = 0;
  numBlanks = 0;
  numTail = 0;
  tentLength;
  rc;
  centralTent = new THREE.Group();
  tentNum;
  tentWeight;
  tentInt;
  colorInt;
  constructor(
    insetWidth,
    insetHeight,
    capAddedHeight,
    numRings,
    numBlanks,
    numTail,
    tentLength,
    tentNum,
    tentWeight,
    tentInt,
    colorInt
  ) {
    this.insetWidth = insetWidth;
    this.insetHeight = insetHeight;
    this.capAddedHeight = capAddedHeight;
    this.numRings = numRings;
    this.numBlanks = numBlanks;
    this.numTail = numTail;
    this.tentLength = tentLength;
    this.tentNum = tentNum;
    this.tentWeight = tentWeight;
    this.tentInt = tentInt;
    this.colorInt = colorInt;
    this.create();
  }

  create() {
    this.getCap();
    this.jellyGroup.add(this.rc.coralRingGroup);
    this.getCentralTent();
    this.jellyGroup.add(this.centralTent);
  }

  getCap() {
    this.rc = new RingCoral(
      this.insetWidth,
      this.insetHeight,
      this.numRings,
      [
        170 + this.capAddedHeight,
        160 + this.capAddedHeight,
        140 + this.capAddedHeight,
        120 + this.capAddedHeight,
        100 + this.capAddedHeight,
        80 + this.capAddedHeight,
        70 + this.capAddedHeight,
        60 + this.capAddedHeight,
        50 + this.capAddedHeight,
        40 + this.capAddedHeight,
      ],
      9,
      50,
      16,
      0.5,
      this.numBlanks,
      this.numTail,
      this.colorInt
    );
  }
  getCentralTent() {
    var tenMat = new LineMaterial({
      dashed: false,
      vertexColors: true,
    });
    const colorSteps = this.rc.colorSteps;
    const numTotalColor = colorSteps.length;
    for (var i = 0; i < this.tentNum; i++) {
      const randomX = MathUtils.randFloat(-2 * Math.PI, 2 * Math.PI);
      const randomZ = MathUtils.randFloat(-2 * Math.PI, 2 * Math.PI);
      const colorStep = colorSteps[MathUtils.randInt(0, numTotalColor - 1)];
      var tent = new Tentacle(
        randomX,
        randomZ,
        this.tentLength,
        colorStep,
        this.tentWeight,
        this.tentInt * (i + 2),
        tenMat
      );
      tent.displayMesh.material.resolution.set(
        this.insetWidth,
        this.insetHeight
      );
      this.coralCrowds.push(tent);
      this.centralTent.add(tent.group);
    }
    this.centralTent.position.y = 40;
    this.centralTent.rotation.x = Math.PI;
  }

  update(time, delta) {
    this.coralCrowds.forEach((tentacle) => {
      tentacle.update(delta);
    });
    this.rc.update(time, delta);
  }
}
