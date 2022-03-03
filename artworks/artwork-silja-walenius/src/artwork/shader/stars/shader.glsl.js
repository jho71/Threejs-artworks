

export const starVertexShader = `

attribute float aPhase;
uniform float  uStarSize;

varying float vPhase;

void main() {
  vPhase = aPhase;
  gl_PointSize = uStarSize;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`


export const starFragmentShader = `uniform float uTime;
uniform sampler2D uParticleMap;
uniform float uSparkleSpeed;
uniform float uAlpha;
varying float vPhase;

void main() {
  float pulse = mix(0.1, 1.0, sin(uSparkleSpeed * uTime + vPhase) * 0.5 + 0.5);
   vec3 outgoingColor = texture2D(uParticleMap, gl_PointCoord).rgb * pulse;
   gl_FragColor = vec4(outgoingColor, uAlpha);
}`

