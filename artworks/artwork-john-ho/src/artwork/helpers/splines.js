import * as THREE from "three";
import  Curves  from './extraCurves';

let curve = new THREE.CatmullRomCurve3( [

    new THREE.Vector3(0, -190,0),	
    new THREE.Vector3(2.598461055934308, -139.33721513372552, 42.91242652112956),	
    new THREE.Vector3(56.830477784202444, 0.9479509802371, 103.95728261818931),	
    new THREE.Vector3(91.66909577841088, 64.56770940901797, 71.19179795768137),	
    new THREE.Vector3(37.61662763047168, 180.30088834744635, 105.33585579986146)

] );

curve = new THREE.CatmullRomCurve3(curve.getPoints(100));

let splines = {
    BaseSpiral : curve,
    GrannyKnot: new Curves.GrannyKnot(),
    HeartCurve: new Curves.HeartCurve(),
    VivianiCurve: new Curves.VivianiCurve(),
    KnotCurve: new Curves.KnotCurve(),
    HelixCurve: new Curves.HelixCurve(),
    TrefoilKnot: new Curves.TrefoilKnot(),
    TorusKnot: new Curves.TorusKnot(),
    CinquefoilKnot: new Curves.CinquefoilKnot(),
    TrefoilPolynomialKnot: new Curves.TrefoilPolynomialKnot(),
    FigureEightPolynomialKnot: new Curves.FigureEightPolynomialKnot(),
    DecoratedTorusKnot4a: new Curves.DecoratedTorusKnot4a(),
    DecoratedTorusKnot4b: new Curves.DecoratedTorusKnot4b(),
    DecoratedTorusKnot5a: new Curves.DecoratedTorusKnot5a(),
    DecoratedTorusKnot5c: new Curves.DecoratedTorusKnot5c(),
  }

export{splines,curve}