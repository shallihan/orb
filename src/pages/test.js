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
  const [geometryPoints, setGeometryPoints] = useState(null);
  const [geometryPositionClone, setGeometryPositionClone] = useState(null);
  const [geometryNormalClone, setGeometryNormalClone] = useState(null);
  const damping = 0.1;
  const [ref, { position }] = useSphere(
    () => ({ args: [0.5], type: "Kinematic", ...props }),
    forwardRef
  );

  useFrame(({ mouse: { x, y }, viewport: { height, width } }) =>
    position.set((x * width) / 2, (y * height) / 2, 0)

    /* if (geometryPoints) {
      const now = Date.now() / 300;
      for (let i = 0; i < geometryPoints; i++) {
        // indices
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        // use uvs to calculate wave
        // use uvs to calculate wave
        const uX = ref.current.geometry.attributes.uv.getX(i) * Math.PI * 3;
        const uY = ref.current.geometry.attributes.uv.getY(i) * Math.PI * 3;

        // calculate current vertex wave height
        const xangle = uX + now;
        const xsin = Math.sin(xangle) * damping;
        const yangle = uY + now;
        const ycos = Math.cos(yangle) * damping;

        // set new position
        ref.current.geometry.attributes.position.setX(
          i,
          geometryPositionClone[ix] + geometryNormalClone[ix] * (xsin + ycos)
        );
        ref.current.geometry.attributes.position.setY(
          i,
          geometryPositionClone[iy] + geometryNormalClone[iy] * (xsin + ycos)
        );
        ref.current.geometry.attributes.position.setZ(
          i,
          geometryPositionClone[iz] + geometryNormalClone[iz] * (xsin + ycos)
        );
      };
      
      ref.current.geometry.computeVertexNormals();
      ref.current.geometry.attributes.position.needsUpdate = true;
    } */
  );

  /* useEffect(() => {
    if (ref.current) {
      setGeometryPoints(ref.current.geometry.attributes.position.count);
      setGeometryPositionClone(
        JSON.parse(
          JSON.stringify(ref.current.geometry.attributes.position.array)
        )
      );
      setGeometryNormalClone(
        JSON.parse(JSON.stringify(ref.current.geometry.attributes.normal.array))
      );
    }
  }, [ref]); */

  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={[1, 64, 64]} />
      <meshNormalMaterial />
    </mesh>
  );
};

const BoxAndBall = () => {
  const [box, ball] = useSpring(useRef(null), useRef(null), {
    damping: 1,
    restLength: 0,
    stiffness: 100,
  });

  return (
    <group>
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
