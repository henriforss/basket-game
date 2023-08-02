//@ts-nocheck
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

const Ball = ({ position, direction, shootVelocity, basketball }) => {
  const ballRef = useRef(null);

  useEffect(() => {
    if (ballRef.current) {
      ballRef.current.setTranslation({
        x: position.x,
        y: position.y,
        z: position.z,
      });
      ballRef.current.setLinvel({
        x: direction.x * shootVelocity,
        y: (direction.y + 0.75) * shootVelocity,
        z: direction.z * shootVelocity,
      });
    }
  }, [position, direction, shootVelocity]);

  return (
    <RigidBody
      ref={ballRef}
      colliders="ball"
      restitution={0.7}
      // friction={1}
      // frictionCombineRule={"max"}
      type="dynamic"
      linearDamping={0.1}
      angularDamping={0.1}
    >
      <mesh castShadow>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial map={basketball} />
      </mesh>
    </RigidBody>
  );
};

export default Ball;
