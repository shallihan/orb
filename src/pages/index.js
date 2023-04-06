import * as THREE from "three";
import React, { Suspense, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import GlobalStyle from "../style";
import {
  Stage,
  OrbitControls,
  MeshDistortMaterial,
  Float,
  useTexture,
} from "@react-three/drei";
import { Mirrors } from "../components";
import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";
import { Perf } from "r3f-perf";
import { Physics, useSphere } from "@react-three/cannon";

const AnimatedMaterial = a(MeshDistortMaterial);

const raycaster = new THREE.Raycaster();
console.log(raycaster);

/* function Pointer() {
  const viewport = useThree((state) => state.viewport);
  const [, api] = useSphere(() => ({
    type: "Kinematic",
    args: [3],
    position: [0, 0, 0],
  }));
  return useFrame((state) =>
    api.position.set(
      (state.mouse.x * viewport.width) / 2,
      (state.mouse.y * viewport.height) / 2,
      0
    )
  );
} */

const LargeOrb = () => {
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
      position={[0, 0, 0]}
      scale={wobble}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      receiveShadow
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
        wireframe
      />
      {/* <portalMaterial ref={portalMaterial} blending={AdditiveBlending} uColorStart="silver" uColorEnd="white" /> */}
    </a.mesh>
  );
};

const Lights = () => (
  <>
    <ambientLight intensity={0.5} args={[1, 64, 64]} />
    <pointLight position={[20, 30, 10]} />
  </>
);

const IndexPage = () => {
  const controls = useRef();
  return (
    <>
      <GlobalStyle />
      <Canvas shadows camera={{ position: [4, -1, 8], fov: 35, zoom: 0.75 }}>
        {/* <Perf position="top-left" /> */}
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
            environment="sunset"
          >
            <Physics gravity={[0, 2, 0]}>
              <LargeOrb />
              <Mirrors />
            </Physics>
          </Stage>
        </Suspense>
        <OrbitControls
          ref={controls}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          enableDamping
          enablePan={false}
          enableRotate
          enableZoom={false}
          reverseOrbit={false}
          makeDefault
        />
      </Canvas>
    </>
  );
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;
