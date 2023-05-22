import * as THREE from "three";
import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import GlobalStyle from "../style";
import { Physics, useSphere, Debug } from "@react-three/cannon";
import { Stage, OrbitControls } from "@react-three/drei";
import { Mesh } from "three";

const rfs = THREE.MathUtils.randFloatSpread;

function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

const Lights = () => (
  <>
    <ambientLight intensity={0.5} args={[1, 64, 64]} />
    <pointLight position={[20, 30, 10]} />
  </>
);

const Planet = () => {
  const [ref, api] = useSphere(
    () => ({
      type: "Static",
    }),
    useRef < Mesh > null
  );
  return (
    <mesh receiveShadow ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="blue" transparent opacity={0.5} />
    </mesh>
  );
};

const Moons = ({
  mat = new THREE.Matrix4(),
  vec = new THREE.Vector3(),
  ...props
}) => {
  const [ref, api] = useSphere(() => ({
    position: [rfs(3), rfs(3), rfs(3)],
    type: "Static",
  }));

  return (
    <instancedMesh ref={ref} args={[null, null, 7]}>
      <sphereBufferGeometry args={[getRandomFloat(0.1, 0.2, 2), 32, 32]} />
      <meshStandardMaterial color="blue" transparent opacity={0.5} />
    </instancedMesh>
  );
};

const Moon = () => {
    const [ref, api] = useSphere(
        () => ({
            args: [0.1],
            mass: 0,
            position: [rfs(3), rfs(3), rfs(3)],
            type: "Static",
        }),
        useRef < Mesh > null
      );
      return (
        <mesh receiveShadow ref={ref}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="blue" transparent opacity={0.5} />
        </mesh>
      );
};

const Other = () => {
  const controls = useRef();
  return (
    <>
      <GlobalStyle />
      <Canvas shadows camera={{ position: [4, -1, 8], fov: 35, zoom: 0.75 }}>
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
            <Physics allowSleep>
              <Debug>
                <Planet />
                <Moon />
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

export default Other;
