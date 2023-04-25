import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import GlobalStyle from "../style";
import {
  Stage,
  OrbitControls,
  MeshDistortMaterial,
  useTexture,
} from "@react-three/drei";
import { Mirrors } from "../components";
import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";
import { Perf } from "r3f-perf";
import { Physics, useSphere } from "@react-three/cannon";

const AnimatedMaterial = a(MeshDistortMaterial);

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
  const [distort, setDistort] = useState(0.75);
  const [hovered, setHovered] = useState(false);
  const [pointCount, setPointCount] = useState(null);
  const [down, setDown] = useState(false);
  const geometry = new THREE.SphereBufferGeometry(1, 64, 64);
  const count = geometry.attributes.position.count;
  console.log(count);
  const [{ wobble, color }] = useSpring(
    {
      wobble: down ? 1.5 : hovered ? 1.1 : 1,
      color: "white",
    },
    [hovered, down]
  );
  const texture = useTexture("/baked.png");
  const sphere = useRef();

  useFrame(() => {
    if (sphere.current) {
      const position_clone = JSON.parse(
        JSON.stringify(sphere.current.attributes.position.array)
      );
      const normals_clone = JSON.parse(
        JSON.stringify(sphere.current.attributes.normal.array)
      );
      const damping = 0.2;
      const now = Date.now() / 300;
      for (let i = 0; i < pointCount; i++) {
        // indices
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        // use uvs to calculate wave
        const uX = sphere.current.attributes.uv.getX(i) * Math.PI * 16;
        const uY = sphere.current.attributes.uy.getY(i) * Math.PI * 16;

        // calculate current vertex wave height
        const xangle = uX + now;
        const xsin = Math.sin(xangle) * damping;
        const yangle = uY + now;
        const ycos = Math.cos(yangle) * damping;

        // set new position
        sphere.current.attributes.position.setX(
          i,
          position_clone[ix] + normals_clone[ix] * (xsin + ycos)
        );
        sphere.current.attributes.position.setY(
          i,
          position_clone[iy] + normals_clone[iy] * (xsin + ycos)
        );
        sphere.current.attributes.position.setZ(
          i,
          position_clone[iz] + normals_clone[iz] * (xsin + ycos)
        );
      }
      sphere.current.computeVertexNormals();
      sphere.current.attributes.position.needsUpdate = true;
    }
  });

  useEffect(() => {
    const points = sphere.current.attributes.position.count;
    setPointCount(points);
  }, [sphere]);

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
      <sphereBufferGeometry ref={sphere} args={[1, 64, 64]} />
      <AnimatedMaterial
        map={texture}
        attach="material"
        distort={0}
        speed={3}
        color={color}
        envMapIntensity="0.5"
        clearcoat="0.75"
        clearcoatRoughness={0}
        metalness={0.1}
        wireframe
      />
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
