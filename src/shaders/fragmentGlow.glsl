uniform sampler2D uPallete;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vDisplace;
varying vec2 vUv;

void main()
{
    ////////// HIGH CONTRAST STRIPES
    float glowBandReducerOut = 60.0;
    float glowBandReducerIn = 150.0;

    float stripesTop = mod(vDisplace * 20.0, 1.0);
    float stripesBottom = mod(vDisplace * 20.0 + 0.13, 1.0);

    //top glow
    float strength = pow(1.0 - stripesTop, glowBandReducerOut);
    strength += pow(stripesTop, glowBandReducerIn);

    //bottom glow
    strength += pow(stripesBottom, glowBandReducerOut);
    strength += pow(1.0 - stripesBottom, glowBandReducerIn);

    //solid stripe
    strength += step(0.87, stripesTop);
    gl_FragColor = vec4(vec3(strength), 1.0);

    //////// SUBTLE COLORS
    vec3 blackColor = vec3(0.0);

    float elevation = (vDisplace + uColorOffset) * uColorMultiplier;
    vec3 depthColor = mix(uSurfaceColor, uDepthColor, elevation);

    vec3 mixedColor = mix(blackColor, depthColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);
}