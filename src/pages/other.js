import * as THREE from "three";
import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import GlobalStyle from "../style";
import { Physics, useSphere, Debug, useSpring } from "@react-three/cannon";
import { Stage, OrbitControls } from "@react-three/drei";
import * as CANNON from "cannon-es";
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

const Planet = ({ props, forwardRef }) => {
  const [ref, { position }] = useSphere(
    () => ({ args: [1, 32, 32], type: "Kinematic", ...props }),
    forwardRef
  );
  useFrame(({ mouse: { x, y }, viewport: { height, width } }) =>
    position.set((x * width) / 2, (y * height) / 2, 0)
  );
  return (
    <mesh receiveShadow ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="blue" transparent opacity={0.5} />
    </mesh>
  );
};

const Moon = ({ props, forwardRef }) => {
  const [ref] = useSphere(
    () => ({
      args: [0.1, 32, 32],
      linearDamping: 0.5,
      mass: 1,
      ...props,
    }),
    forwardRef
  );
  return (
    <mesh receiveShadow ref={ref}>
      <sphereGeometry args={[0.1, 64, 64]} />
      <meshStandardMaterial color="blue" transparent opacity={0.5} />
    </mesh>
  );
};

const PlanetAndMoon = () => {
  const [planet, moon, api] = useSpring(useRef(null), useRef(null), {
    damping: 1,
    restLength: 0,
    stiffness: 100,
  });
  return (
    <group>
      <Planet forwardRef={planet} position={[0, 0, 0]} />
      <Moon forwardRef={moon} position={[-1.1, 0, 0]} />
    </group>
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
            <Physics gravity={[0, -40, 0]} allowSleep={false}>
              <Debug>
                <PlanetAndMoon />
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
