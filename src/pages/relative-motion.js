import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import GlobalStyle from "../style";
import { Depth, Fresnel, LayerMaterial } from "lamina";
import { Physics, useSphere, Debug, useSpring } from "@react-three/cannon";
import { a } from "@react-spring/three";
import {
  Stage,
  OrbitControls,
  MeshDistortMaterial,
  useTexture,
} from "@react-three/drei";

const AnimatedMaterial = a(MeshDistortMaterial);

const moons = [
  { name: "callisto", position: [1.2, 0, 0], args: [0.2, 64, 64] },
  { name: "europa", position: [1.1, 0, 0], args: [0.1, 64, 64] },
  { name: "helene", position: [1.1, 0, 0], args: [0.1, 64, 64] },
  { name: "oberon", position: [1.3, 0, 0], args: [0.3, 64, 64] },
  { name: "titan", position: [1.1, 0, 0], args: [0.1, 64, 64] },
  { name: "portia", position: [1.2, 0, 0], args: [0.2, 64, 64] },
];

const joints = [
  {
    angle: 0,
    axisA: [1, 0, 0],
    axisB: [1, 0, 0],
    bodyA: "planet",
    bodyB: "callisto",
    pivotA: [1, 0, 0],
    pivotB: [1.2, 0, 0],
    twistAngle: 0,
  },
  {
    angle: 0,
    axisA: [1, 0, 0],
    axisB: [1, 0, 0],
    bodyA: "planet",
    bodyB: "europa",
    pivotA: [0.1, 0, 0],
    pivotB: [1.1, 0, 0],
    twistAngle: 0,
  },
  {
    angle: 0,
    axisA: [1, 0, 0],
    axisB: [1, 0, 0],
    bodyA: "planet",
    bodyB: "helene",
    pivotA: [1, 0, 0],
    pivotB: [1.1, 0, 0],
    twistAngle: 0,
  },
  {
    angle: 0,
    axisA: [1, 0, 0],
    axisB: [1, 0, 0],
    bodyA: "planet",
    bodyB: "oberon",
    pivotA: [1, 0, 0],
    pivotB: [1.3, 0, 0],
    twistAngle: 0,
  },
  {
    angle: 0,
    axisA: [1, 0, 0],
    axisB: [1, 0, 0],
    bodyA: "planet",
    bodyB: "titan",
    pivotA: [1, 0, 0],
    pivotB: [1.1, 0, 0],
    twistAngle: 0,
  },
  {
    angle: 0,
    axisA: [1, 0, 0],
    axisB: [1, 0, 0],
    bodyA: "planet",
    bodyB: "portia",
    pivotA: [1, 0, 0],
    pivotB: [1.2, 0, 0],
    twistAngle: 0,
  },
];

const Lights = () => (
  <>
    <ambientLight intensity={0.5} args={[1, 64, 64]} />
    <pointLight position={[20, 30, 10]} />
  </>
);

const Planet = ({ props, forwardRef }) => {
  const [scale, setScale] = useState(1);
  const texture = useTexture("/baked.png");
  const [ref, { position }] = useSphere(
    () => ({ args: [1, 64, 64], type: "Kinematic", ...props }),
    forwardRef
  );

  useFrame(({ mouse: { x, y }, viewport: { height, width } }) => {
    position.set((x * width) / 2, (y * height) / 2, 0);
  });

  return (
    <a.mesh
      receiveShadow
      ref={ref}
      onPointerDown={() => setScale(0.75)}
      onPointerUp={() => setScale(1)}
    >
      <sphereBufferGeometry args={[1, 64, 64]} />
      <AnimatedMaterial
        map={texture}
        attach="material"
        distort={0}
        speed={3}
        color="white"
        envMapIntensity="0.5"
        clearcoat="0.75"
        clearcoatRoughness={0}
        metalness={0.1}
      />
    </a.mesh>
  );
};

const Moon = ({ position, args, name, forwardRef }) => {
  const [ref] = useSphere(
    () => ({
      linearDamping: 0.5,
      mass: 1,
      position,
      args
    }),
    forwardRef
  );
  return (
    <mesh ref={ref}>
      <sphereGeometry args={args} />
      <LayerMaterial
        color={"#ffffff"}
        lighting={"physical"} //
        transmission={1}
        roughness={0.1}
        thickness={2}
      >
        <Depth
          near={0.4854}
          far={0.7661999999999932}
          origin={[-0.4920000000000004, 0.4250000000000003, 0]}
          colorA={"#CE9200"}
          colorB={"#FFFFFF"}
        />
        <Fresnel
          color={"#fefefe"}
          bias={-0.3430000000000002}
          intensity={3.8999999999999946}
          power={3.3699999999999903}
          factor={1.119999999999999}
          mode={"softlight"}
        />
      </LayerMaterial>
    </mesh>
  );
};

const PlanetAndMoon = () => {
  const [planet, moon] = useSpring(useRef(null), useRef([]), {
    damping: 1,
    restLength: 0,
    stiffness: 100,
  });

  return (
    <group>
      <Planet forwardRef={planet} position={[0, 0, 0]} name={"planet"} />
      <Moon
        forwardRef={moon}
        position={moons[4].position}
        args={moons[4].args}
        name={moons[4].name}
      />
    </group>
  );
};

const RelativeMotion = () => {
  const controls = useRef();
  return (
    <>
      <GlobalStyle />
      <Canvas camera={{ position: [4, -1, 8], fov: 35, zoom: 0.75 }}>
        <Lights />
        <Suspense fallback={null}>
          <Stage
            controls={controls}
            intensity={0.5}
            preset="rembrandt"
            adjustCamera={1}
            environment="sunset"
          >
            <Physics gravity={[0, 10, 0]} allowSleep={false}>
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

export default RelativeMotion;
