import React from "react";
import { Physics, useBox, useSphere, useSpring } from "@react-three/cannon";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import GlobalStyle from "../style";

const Box = ({ props, forwardRef }) => {
  const [ref] = useSphere(
    () => ({
      args: [0.1, 64, 64],
      linearDamping: 0.5,
      mass: 1,
      ...props,
    }),
    forwardRef
  );
  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={[0.1, 64, 64]} />
      <meshNormalMaterial />
    </mesh>
  );
};

const Ball = ({ props, forwardRef }) => {
  const [ref, { position }] = useSphere(
    () => ({ args: [0.5], type: "Kinematic", ...props }),
    forwardRef
  );
  useFrame(({ mouse: { x, y }, viewport: { height, width } }) =>
    position.set((x * width) / 2, (y * height) / 2, 0)
  );

  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={[1, 64, 64]} />
      <meshNormalMaterial />
    </mesh>
  );
};

const BoxAndBall = () => {
  const [box, ball, api] = useSpring(useRef(null), useRef(null), {
    damping: 1,
    restLength: 0,
    stiffness: 100,
  });
  const [isDown, setIsDown] = useState(false);

  useEffect(() => api.setRestLength(isDown ? 0 : 0), [isDown]);

  return (
    <group
      onPointerDown={() => setIsDown(true)}
      onPointerUp={() => setIsDown(false)}
    >
      <Box forwardRef={box} position={[1, 0, 0]} />
      <Ball forwardRef={ball} position={[-1, 0, 0]} />
    </group>
  );
};

const style = {
  color: "white",
  fontSize: "1.2em",
  left: 50,
  position: "absolute",
  top: 20,
};

export default () => {
  return (
    <>
      <GlobalStyle />
      <Canvas camera={{ fov: 50, position: [0, 0, 8] }}>
        <color attach="background" args={["#171720"]} />
        <Physics gravity={[0, -40, 0]} allowSleep={false}>
          <BoxAndBall />
        </Physics>
      </Canvas>
      <div style={style}>
        <pre>* click to tighten constraint</pre>
      </div>
    </>
  );
};
