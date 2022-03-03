const params = {
    camSpeed: 0.1,
    numParticles: 147, //number of particles currently visible
    maxDistance: 3.2, //max distancne two pointns cann be and still be connected
    particleSpeed: 0.008,
    lineOpacity: 0.3, //no longer necessary - used opacity prop on materia;s
    limitConnections: true,
    maxConnections: 40,
    radius : 5, //length of each side of geometry
    inhaleLength : 4,
    exhaleLength: 4,
    holdLength: 4,
    starCount: 1000,
    starSpeed: {x: 0.004, y: 0.01},
    starLimit: 300
  };


  const maxParticles = 285; //max number of points


module.exports = {
    params : params,
    maxParticles : maxParticles
}