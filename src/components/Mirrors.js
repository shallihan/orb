import React from "react";
import { Depth, Fresnel, LayerMaterial } from "lamina";
import { data } from "../data";
import { RigidBody } from "@react-three/rapier";

const Mirrors = () => {
  return (
    <group position={[0, -1.5, 0]}>
      {data.mirrors.map((mirror, index) => (
        <RigidBody colliders="ball">
          <mesh position={mirror.position} rotation={mirror.rotation}>
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
              args={mirror.args}
              key={`mirror-${index}`}
              name={`mirror-${index}`}
            />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
};

export default Mirrors;
