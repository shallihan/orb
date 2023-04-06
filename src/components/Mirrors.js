import React, { useRef } from "react";
import * as THREE from "three";
import { Depth, Fresnel, LayerMaterial } from "lamina";
import { data } from "../data";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Physics, useSphere } from "@react-three/cannon";

const rfs = THREE.MathUtils.randFloatSpread;

function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

const Mirrors = ({
  mat = new THREE.Matrix4(),
  vec = new THREE.Vector3(),
  ...props
}) => {
  const [ref, api] = useSphere(() => ({
    args: [1],
    mass: 0.5,
    angularDamping: 0.1,
    linearDamping: 0.65,
    position: [rfs(10), rfs(10), rfs(10)],
  }));
  useFrame((state) => {
    for (let i = 0; i < 6; i++) {
      // Get current whereabouts of the instanced sphere
      ref.current.getMatrixAt(i, mat);
      // Normalize the position and multiply by a negative force.
      // This is enough to drive it towards the center-point.
      api
        .at(i)
        .applyForce(
          vec
            .setFromMatrixPosition(mat)
            .normalize()
            .multiplyScalar(-50)
            .toArray(),
          [0, 0, 0]
        );
    }
  });
  return (
    <instancedMesh
      ref={ref}
      args={[null, null, 7]}
    >
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
      <sphereBufferGeometry
        args={[0.2, 32, 32]}
      />
    </instancedMesh>
  );
};

export default Mirrors;
