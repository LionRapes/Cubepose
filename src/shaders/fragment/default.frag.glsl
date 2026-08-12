uniform sampler2D uTexture;
uniform float uOpacity;

varying vec2 vUv;

void main() {
    vec4 backgroundColor = texture(uTexture, vUv);
    gl_FragColor = vec4(backgroundColor.rgb, backgroundColor.a * (uOpacity > 0.0 ? uOpacity : 1.0));
}