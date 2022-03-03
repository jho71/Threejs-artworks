
const vertex = `

    uniform float time;
uniform float seed; 

varying vec3 vNormal;
varying float vRadius;

#define NUM_OCTAVES 5

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}


float fbm(vec3 x) {
	float v = 0.0;
	float a = 0.5;
	vec3 shift = vec3(100);
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}


void main()
{
    vNormal = normal;
    vec3 newPosition = position;

    float radius = 1.0;
    float noise = fbm(position * 0.6 + time * 0.07 + seed);
    //multiply each point by some noise

    radius *= mix(0.8, 1.6, noise);

    newPosition *= radius;
    vRadius = radius;


    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

const fragment = `
uniform float time;

varying vec3 vNormal;
varying float vRadius;

#define NUM_OCTAVES 5

float mod289(float x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}

float noise(vec3 p){
    vec3 a=floor(p);
    vec3 d=p-a;
    d=d*d*(3.-2.*d);
    
    vec4 b=a.xxyy+vec4(0.,1.,0.,1.);
    vec4 k1=perm(b.xyxy);
    vec4 k2=perm(k1.xyxy+b.zzww);
    
    vec4 c=k2+a.zzzz;
    vec4 k3=perm(c);
    vec4 k4=perm(c+1.);
    
    vec4 o1=fract(k3*(1./41.));
    vec4 o2=fract(k4*(1./41.));
    
    vec4 o3=o2*d.z+o1*(1.-d.z);
    vec2 o4=o3.yw*d.x+o3.xz*(1.-d.x);
    
    return o4.y*d.y+o4.x*(1.-d.y);
}

float fbm(vec3 x){
    float v=0.;
    float a=.5;
    vec3 shift=vec3(100);
    for(int i=0;i<NUM_OCTAVES;++i){
        v+=a*noise(x);
        x=x*2.+shift;
        a*=.5;
    }
    return v;
}

void main()
{
    vec3 color1=vec3(.988,.6,.6);
    vec3 color2=vec3(.988,.83,.6);
    vec3 color3=vec3(.95,.64,.353);

    float gradMovementY = 0.2 * sin(time);
    float gradMovementX = 0.3 * sin(time);

    vec3 normNormal = normalize(vNormal) * 0.5 + 0.5;

    float mixAmtX = clamp(normNormal.x * 0.25 + gradMovementX, 0.0, 1.0);
    float mixAmtY = clamp(normNormal.y * 0.75 + gradMovementX, 0.0, 1.0);
    float mixAmtZ = clamp(normNormal.z + gradMovementY, 0.0, 1.0);
    
    vec3 color4 = mix(
        mix(color1, color2, mixAmtX),
        mix(color1, color3, mixAmtY),
        mixAmtZ
    );

    float mixer1 = smoothstep(0.8, 1.3, vRadius);
    float mixer2 = smoothstep(1.2, 1.6, vRadius);
    
    vec3 color = mix(color2, color4, mixer1);
    color = mix(color, color1, mixer2);
    
    gl_FragColor=vec4(color,1.);
} 

`

module.exports = {
    sphereVertexShader : vertex,
    sphereFragmentShader : fragment
}