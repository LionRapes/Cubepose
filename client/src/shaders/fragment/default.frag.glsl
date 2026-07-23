uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    vec4 backgroundColor = texture(uTexture, vUv);
    gl_FragColor = backgroundColor;
}