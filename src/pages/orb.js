import { Color } from "three";
import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, extend } from "@react-three/fiber";
import GlobalStyle from "../style";
import {
  Stage,
  OrbitControls,
  MeshDistortMaterial,
  shaderMaterial,
  useTexture,
} from "@react-three/drei";
import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";
import glsl from "babel-plugin-glsl/macro";

const AnimatedMaterial = a(MeshDistortMaterial);

const LargeOrb = () => {
  const sphere = useRef();
  /* const portalMaterial = useRef();
  useFrame((state, delta) => (portalMaterial.current.uTime += delta)) */
  const [distort, setDistort] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [down, setDown] = useState(false);
  const [{ wobble, color }] = useSpring(
    {
      wobble: down ? 1.5 : hovered ? 1.1 : 1,
      color: "white",
    },
    [hovered, down]
  );
  const texture = useTexture("/baked.png");

  setTimeout(() => {
    setDistort(0.75);
  }, 3000);

  return (
    <a.mesh
      position={[0, 2, 0]}
      scale={wobble}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      receiveShadow
      ref={sphere}
    >
      <sphereBufferGeometry args={[1, 64, 64]} />
      <AnimatedMaterial
        map={texture}
        attach="material"
        distort={distort}
        speed={3}
        color={color}
        envMapIntensity="0.5"
        clearcoat="0.75"
        clearcoatRoughness={0}
        metalness={0.1}
      />
      {/* <portalMaterial ref={portalMaterial} blending={AdditiveBlending} uColorStart="silver" uColorEnd="white" /> */}
    </a.mesh>
  );
};

const Lights = () => (
  <>
    <ambientLight intensity={0.5} />
    <pointLight position={[20, 30, 10]} />
  </>
);

const Orb = () => {
  const controls = useRef();
  return (
    <>
      <GlobalStyle />
      <Canvas shadows camera={{ position: [4, -1, 8], fov: 35 }}>
        <Lights />
        <Suspense fallback={null}>
          <Stage
            controls={controls}
            intensity={0.5}
            preset="rembrandt"
            shadows={{
              type: "accumulative",
              opacity: 2,
            }}
            adjustCamera={1}
            environment="city"
          >
            <LargeOrb />
          </Stage>
        </Suspense>
        <OrbitControls
          ref={controls}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.9}
          makeDefault
        />
      </Canvas>
    </>
  );
};

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new Color("hotpink"),
    uColorEnd: new Color("white"),
  },
  glsl`
    varying vec2 vUv;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      gl_Position = projectionPosition;
      vUv = uv;
    }`,
  glsl`
    #pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl) 
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    varying vec2 vUv;
    void main() {
      vec2 displacedUv = vUv + cnoise3(vec3(vUv * 7.0, uTime * 0.1));
      float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));
      float outerGlow = distance(vUv, vec2(0.5)) * 4.0 - 1.4;
      strength += outerGlow;
      strength += step(-0.2, strength) * 0.8;
      strength = clamp(strength, 0.0, 1.0);
      vec3 color = mix(uColorStart, uColorEnd, strength);
      gl_FragColor = vec4(color, 1.0);
    }`
);

extend({ PortalMaterial });

export default Orb;
