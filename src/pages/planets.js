import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import GlobalStyle from "../style";
import { Depth, Fresnel, LayerMaterial } from "lamina";
import { Physics, useSphere, Debug, useSpring } from "@react-three/cannon";
import { Stage, OrbitControls } from "@react-three/drei";

const context = createContext(createRef(null));

const Lights = () => (
  <>
    <ambientLight intensity={0.5} args={[1, 64, 64]} />
    <pointLight position={[20, 30, 10]} />
  </>
);

const Planet = ({ props, forwardRef, config = {}, name }) => {
  const [ref, { position }] = useSphere(
    () => ({ args: [1, 32, 32], type: "Kinematic", ...props }),
    forwardRef
  );

  useFrame(({ mouse: { x, y }, viewport: { height, width } }) => {
    position.set((x * width) / 2, (y * height) / 2, 0);
  });

  return (
    <mesh receiveShadow ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="blue" transparent opacity={0.5} />
    </mesh>
  );
};

const Moon = ({ props, forwardRef }) => {
  const { args } = props;
  const [ref] = useSphere(
    () => ({
      linearDamping: 0.5,
      mass: 1,
      ...props,
    }),
    forwardRef
  );
  return (
    <mesh receiveShadow ref={ref}>
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
  return (
    <Planet position={[0, 0, 0]} args={[1, 64, 64]}>
      <Moon
        position={[-1.1, 0, 0]}
        args={[0.1, 32, 32]}
        config={joints["planetJoint"]}
      />
    </Planet>
  );
};

const Planets = () => {
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
            <Physics gravity={[0, -200, 0]} allowSleep={false}>
              <Debug>
                <PlanetAndMoon position={[0, 0, 0]} />
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

export default Planets;
