import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import GlobalStyle from "../style";
import { Depth, Fresnel, LayerMaterial } from "lamina";
import { Physics, useSphere, Debug, useRaycastVehicle } from "@react-three/cannon";
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
  { name: "europa", position: [0.5, 0.7, -0.7], args: [0.1, 64, 64] },
  { name: "helene", position: [1.05, 0.3, 0], args: [0.1, 64, 64] },
  { name: "oberon", position: [-1.3, 0, 0], args: [0.3, 64, 64] },
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
      args,
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
  const chassis = useRef();
  const moon1 = useRef();
  const moon2 = useRef();
  const moon3 = useRef();
  const moon4 = useRef();

  const wheelInfo = {
    radius: 0.1,
    directionLocal: [0, -1, 0],
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    axleLocal: [-1, 0, 0],
    chassisConnectionPointLocal: [1, 0, 1],
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -0.1,
    frictionSlip: 1.5,
    sideAcceleration: 2
  }

  const wheelInfo1 = { ...wheelInfo, isFrontWheel: true, chassisConnectionPointLocal: [-1 / 2, 1, 1] }
  const wheelInfo2 = { ...wheelInfo, isFrontWheel: true, chassisConnectionPointLocal: [1/ 2, 1, 1] }
  const wheelInfo3 = { ...wheelInfo, isFrontWheel: false, chassisConnectionPointLocal: [1 / 2, 1, -1] }
  const wheelInfo4 = { ...wheelInfo, isFrontWheel: false, chassisConnectionPointLocal: [1 / 2, 1, -1] }

  const [vehicle, api] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels: [moon1, moon2, moon3, moon4],
    wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1
  }));
  

  return (
    <group ref={vehicle}>
      <Planet forwardRef={chassis} position={[0, 0, 0]} name={"planet"} />
       <Moon
        forwardRef={moon1}
        position={moons[0].position}
        args={moons[0].args}
        name={moons[0].name}
      />
      <Moon
        forwardRef={moon2}
        position={moons[1].position}
        args={moons[1].args}
        name={moons[1].name}
      />
       <Moon
        forwardRef={moon3}
        position={moons[2].position}
        args={moons[2].args}
        name={moons[2].name}
      />
       <Moon
        forwardRef={moon4}
        position={moons[3].position}
        args={moons[3].args}
        name={moons[3].name}
      />
    </group>
  );
};

const Raycast = () => {
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

export default Raycast;