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
import { Physics, useSphere, Debug } from "@react-three/cannon";
import { Mesh } from "three";

const AnimatedMaterial = a(MeshDistortMaterial);

const LargeOrb = () => {
  const [distort, setDistort] = useState(0.75);
  const [hovered, setHovered] = useState(false);
  const [pointCount, setPointCount] = useState(null);
  const [positionClone, setPositionClone] = useState(null);
  const [normalsClone, setNormalsClone] = useState(null);
  const [down, setDown] = useState(false);

  const [{ wobble, color }] = useSpring(
    {
      wobble: down ? 1.5 : hovered ? 1.3 : 1.2,
      color: "white",
    },
    [hovered, down]
  );
  const texture = useTexture("/baked.png");
  const sphere = useRef();

  const [ref, api] = useSphere(
    () => ({
      type: "Static",
    }),
    useRef < Mesh > null
  );

  const damping = 0.1;

  useFrame(() => {
    if (sphere.current) {
      const now = Date.now() / 300;

      for (let i = 0; i < pointCount; i++) {
        // indices
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        // use uvs to calculate wave
        // use uvs to calculate wave
        const uX = sphere.current.attributes.uv.getX(i) * Math.PI * 3;
        const uY = sphere.current.attributes.uv.getY(i) * Math.PI * 3;

        // calculate current vertex wave height
        const xangle = uX + now;
        const xsin = Math.sin(xangle) * damping;
        const yangle = uY + now;
        const ycos = Math.cos(yangle) * damping;

        // set new position
        sphere.current.attributes.position.setX(
          i,
          positionClone[ix] + normalsClone[ix] * (xsin + ycos)
        );
        sphere.current.attributes.position.setY(
          i,
          positionClone[iy] + normalsClone[iy] * (xsin + ycos)
        );
        sphere.current.attributes.position.setZ(
          i,
          positionClone[iz] + normalsClone[iz] * (xsin + ycos)
        );
      }

      sphere.current.computeVertexNormals();
      sphere.current.attributes.position.needsUpdate = true;
    }
  });

  useEffect(() => {
    const points = sphere.current.attributes.position.count;
    setPointCount(points);
    setPositionClone(
      JSON.parse(JSON.stringify(sphere.current.attributes.position.array))
    );
    setNormalsClone(
      JSON.parse(JSON.stringify(sphere.current.attributes.normal.array))
    );
    if (sphere.current) {
      const now = Date.now() / 300;

      for (let i = 0; i < pointCount; i++) {
        // indices
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        // use uvs to calculate wave
        // use uvs to calculate wave
        const uX = sphere.current.attributes.uv.getX(i) * Math.PI * 3;
        const uY = sphere.current.attributes.uv.getY(i) * Math.PI * 3;

        // calculate current vertex wave height
        const xangle = uX + now;
        const xsin = Math.sin(xangle) * damping;
        const yangle = uY + now;
        const ycos = Math.cos(yangle) * damping;

        // set new position
        sphere.current.attributes.position.setX(
          i,
          positionClone[ix] + normalsClone[ix] * (xsin + ycos)
        );
        sphere.current.attributes.position.setY(
          i,
          positionClone[iy] + normalsClone[iy] * (xsin + ycos)
        );
        sphere.current.attributes.position.setZ(
          i,
          positionClone[iz] + normalsClone[iz] * (xsin + ycos)
        );
      }

      sphere.current.computeVertexNormals();
      sphere.current.attributes.position.needsUpdate = true;
    }
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
      ref={ref}
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
  const collider = useRef();

  useEffect(() => {
    console.log("Collider: ", collider);
  }, [collider]);

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
              <Debug scale={1.1}>
                <LargeOrb />
                <Mirrors />
              </Debug>
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
