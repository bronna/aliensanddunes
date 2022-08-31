//uniform float uTime;
//uniform vec3 uColor;
uniform sampler2D uPallete;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vDisplace;
varying vec2 vUv;

void main()
{
    /////// STRIPED TEXTURE
    // vec2 stripPos = vec2( 0.0, vDisplace );
    // vec4 stripColor = texture2D( uPallete, stripPos );
    // stripColor *= pow(1.0 - vDisplace, 1.0);

    // gl_FragColor = stripColor;

    //////// RAINBOW LAVA
    // float color1 = vDisplace * 2.0;
    // vec2 greenBlue = vUv;

    // float color2 = vUv[0];
    // float color3 = vUv[1];

    // gl_FragColor = vec4(color1, color2, color3, 1.0); // awesome rainbow effect

    ////// FADE OUT
    // float strength = vUv.x * 1.0;
    // float strength2 = (1.0 - (vUv.y)) * 1.0;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    /////// CIRCULAR FADE OUT
    // float strength = 0.4 / distance(vUv, vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    ////////// HIGH CONTRAST STRIPES
    float strength = mod(vDisplace * 20.0, 1.0);
    strength = step(0.87, strength); // do 0.9 for black + white, 0.8 for rainbow
    gl_FragColor = vec4(vec3(strength), 1.0);

    //////// ADD RAINBOW TO HIGH CONTRAST STRIPES
    // vec3 blackColor = vec3(0.0);

    // vec3 uvColor = vec3(vUv.x, vUv.y, 1.0);

    // float heightColor = vDisplace * 2.0;
    // vec2 rainbow = vec2(vUv.x*1.5, vUv.y*1.5);
    // vec3 rainbowHeights = vec3(heightColor*1.5, rainbow);

    // vec3 mixedColor = mix(blackColor, rainbowHeights, strength);

    // gl_FragColor = vec4(mixedColor, 1.0);

    //////// SUBTLE COLORS (try a viridis or diverging scheme)
    vec3 blackColor = vec3(0.08);

    float elevation = (vDisplace + uColorOffset) * uColorMultiplier;
    vec3 depthColor = mix(uSurfaceColor, uDepthColor, elevation);

    vec3 mixedColor = mix(blackColor, depthColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);

    //gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);

    // Cool UV gradient
    // gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);

}