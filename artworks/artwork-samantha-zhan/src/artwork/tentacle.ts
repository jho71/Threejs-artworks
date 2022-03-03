import {
  CatmullRomCurve3,
  Color,
  Group,
  MathUtils,
  Vector3,
} from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";


export default class Tentacle {
  totalPoints: number = 10;
  tenticleHeight: number = 5;
  group: Group;
  meshes: Array<Vector3>;
  time: number = 0;

  movementRangeX: number = 2;
  movementRangeZ: number = 2;
  totalPhaseX: number = Math.PI;
  totalPhaseZ: number = Math.PI;
  width: number = 5;
  colorStep: number = 0;

  value: number = 0;
  randomX: number = -2.4;
  randomZ: number = 1;
  intensity: number = 1;

  point: Vector3[];

  matLine: LineMaterial;
  geometry: LineGeometry = new LineGeometry();
  displayMesh: Line2;
  constructor(
    randomX: number,
    randomZ: number,
    height: number,
    colorStep: number,
    weight: number,
    intensity: number,
    material: LineMaterial
  ) {
    this.matLine = material;
    this.matLine.worldUnits = true;
    this.matLine.needsUpdate = true;
    // this.matLine.linewidth = this.width;
    this.displayMesh = new Line2(this.geometry, this.matLine);
    this.randomX = randomX;
    this.randomZ = randomZ;
    // this.tenticleHeight = MathUtils.randFloat(5, 20);
    this.group = new Group();
    this.tenticleHeight = height;
    this.width = weight;
    this.matLine.linewidth = this.width;
    this.colorStep = colorStep;
    this.intensity = intensity;

    this.movementRangeX = this.movementRangeX * intensity;
    this.movementRangeZ = this.movementRangeZ * intensity;

    this.create();
    this.point = new CatmullRomCurve3(this.meshes).getPoints(9);
    this.updateColor(this.colorStep);
    this.group.add(this.displayMesh);

    this.updateDisplay();
  }

  create = () => {
    this.meshes = new Array<Vector3>(this.totalPoints);
    this.updatePositions();
    this.updateDisplay();
  };

  updatePositions = () => {
    for (let i = 0; i < this.totalPoints; i++) {
      const percent = i / (this.totalPoints - 1);
      const position = new Vector3();
      position.y = MathUtils.lerp(0, this.tenticleHeight, percent);
      this.meshes[i] = position;
    }
  };

  percent = 0;
  phaseX = 0;
  phaseZ = 0;
  moveMovementX = 0;
  moveMovementZ = 0;
  
  update(delta: number) {
    this.time += delta;

    for (let i = 0; i < this.meshes.length; i++) {
      this.percent = i / (this.meshes.length - 1);
      this.phaseX = this.percent * this.totalPhaseX + this.randomX;
      this.phaseZ = this.percent * this.totalPhaseZ + this.randomZ;

      this.moveMovementX = Math.sin(this.time + this.phaseX) * 0.2 + 0.5;
      this.moveMovementZ = Math.cos(this.time + this.phaseZ) * 0.2 + 0.5;
      this.meshes[i].x =
        this.percent *
        MathUtils.lerp(
          -this.movementRangeX,
          this.movementRangeX,
          this.moveMovementX
        );
      this.meshes[i].z =
        this.percent *
        MathUtils.lerp(
          -this.movementRangeZ,
          this.movementRangeZ,
          this.moveMovementZ
        );
    }
    this.updateDisplay();
  }
  positions = [];
  colors = [];
  color = new Color();

  updateColor(cs: number) {
    this.colors = [];
    for (var l = 0; l < this.point.length; l++) {
      this.positions.push(new Vector3());
      this.color.setHSL(l / 100 + cs, 1, 0.5);
      this.colors.push(this.color.r, this.color.g, this.color.b);
    }
    this.geometry.setColors(this.colors);
  }

  updateDisplay() {
    this.positions = [];

    const point = new CatmullRomCurve3(this.meshes).getPoints(9);

    for (var l2 = 0; l2 < point.length; l2++) {
      this.positions.push(point[l2].x, point[l2].y, point[l2].z);
    }

    this.geometry.setPositions(this.positions);
  }
}
