uniform sampler2D uPallete;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vDisplace;
varying vec2 vUv;

void main()
{
    // ////////// HIGH CONTRAST STRIPES
    float strength = mod(vDisplace * 20.0 - 0.1, 1.0);
    strength = step(0.7, strength); // do 0.9 for black + white, 0.8 for rainbow

    //////// SUBTLE COLORS
    vec3 blackColor = vec3(0.0);

    float elevation = (vDisplace + uColorOffset) * uColorMultiplier;
    vec3 depthColor = mix(uSurfaceColor, uDepthColor, elevation);

    vec3 mixedColor = mix(blackColor, depthColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);
}