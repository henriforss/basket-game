//@ts-nocheck
import { Box, Cylinder } from "@react-three/drei";
import { useLoader, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { DoubleSide, Vector3 } from "three";
import ballImage from "../src/img/basketball.jpg";
import floorImage from "../src/img/concrete.png";
import fenceImage from "../src/img/fence.png";
import backboardImage from "../src/img/graffiti.jpg";
import Ball from "./Ball";

const Game = ({ shootVelocity, setGoals }) => {
  const [ballArray, setBallArray] = useState([]);
  const { camera } = useThree();

  /* Texture. */
  const floor = useLoader(THREE.TextureLoader, floorImage);
  floor.wrapS = THREE.RepeatWrapping;
  floor.wrapT = THREE.RepeatWrapping;
  floor.repeat.set(4, 4);

  const fence = useLoader(THREE.TextureLoader, fenceImage);
  fence.wrapS = THREE.RepeatWrapping;
  fence.wrapT = THREE.RepeatWrapping;
  fence.repeat.set(200, 100);

  const basketball = useLoader(THREE.TextureLoader, ballImage);
  basketball.wrapS = THREE.RepeatWrapping;
  basketball.wrapT = THREE.RepeatWrapping;
  basketball.repeat.set(2, 2);

  const backboard = useLoader(THREE.TextureLoader, backboardImage);
  // backboard.wrapS = THREE.RepeatWrapping;
  // backboard.wrapT = THREE.RepeatWrapping;
  // backboard.repeat.set(2, 2);

  const net = useLoader(THREE.TextureLoader, fenceImage);
  net.wrapS = THREE.RepeatWrapping;
  net.wrapT = THREE.RepeatWrapping;
  net.repeat.set(20, 10);

  const handleGoal = () => {
    setGoals((prev) => prev + 3);
  };

  /* Shoot ball when shootVelocity changes. */
  useEffect(() => {
    if (shootVelocity !== null) {
      const position = camera.position;
      const direction = camera.getWorldDirection(new Vector3());

      const newBall = {
        position,
        direction,
        shootVelocity,
      };

      setBallArray((prev) => [...prev, newBall]);
    }
  }, [shootVelocity, camera]);

  console.log(ballArray);

  return (
    <>
      <Suspense>
        <Physics>
          {ballArray.map((ball, i) => {
            return (
              <Ball
                key={`ball_${i}`}
                position={ball.position}
                direction={ball.direction}
                shootVelocity={ball.shootVelocity}
                basketball={basketball}
              />
            );
          })}

          {/* Backboard. */}
          <RigidBody
            position={[0, 14, -13]}
            colliders="cuboid"
            lockRotations
            lockTranslations
          >
            <Box
              args={[10, 5, 0.2]}
              // material-color="teal"
              castShadow
              receiveShadow
              material={
                new THREE.MeshStandardMaterial({
                  flatShading: true,
                  map: backboard,
                  transparent: false,
                })
              }
            />
          </RigidBody>

          <RigidBody
            position={[0, 11, -10]}
            colliders="trimesh"
            lockTranslations
            lockRotations
          >
            <Cylinder
              args={[2, 2, 0.2, 40, 1, true]}
              position={[0, 1, 0]}
              material-color="red"
              material-side={DoubleSide}
              // material={
              //   new THREE.MeshStandardMaterial({
              //     flatShading: true,
              //     map: net,
              //     transparent: true,
              //   })
              // }
              castShadow
            />

            <Cylinder
              args={[2, 1.5, 2, 40, 1, true]}
              // material-color="yellow"
              material-side={DoubleSide}
              material={
                new THREE.MeshStandardMaterial({
                  flatShading: true,
                  map: net,
                  transparent: true,
                })
              }
              castShadow
            />

            <CuboidCollider
              position={[0, -1, 0]}
              args={[1, 0.1, 1]}
              sensor
              onIntersectionEnter={() => handleGoal()}
            />
          </RigidBody>

          <RigidBody
            type="fixed"
            // lockRotations
            // lockTranslations
            colliders="cuboid"
            // friction={1}
            // frictionCombineRule={"max"}
          >
            {/* Ground. */}
            <Box
              // position={[0, 40, 0]}
              args={[200, 0.2, 200]}
              receiveShadow
              material={
                new THREE.MeshStandardMaterial({
                  flatShading: true,
                  map: floor,
                  transparent: false,
                })
              }
              // material-side={DoubleSide}
            />

            {/* Front fence. */}
            <Box
              args={[40, 40, 0.2]}
              position={[0, 20, -40]}
              receiveShadow
              material={
                new THREE.MeshStandardMaterial({
                  flatShading: true,
                  map: fence,
                  transparent: true,
                })
              }
              // material-side={DoubleSide}
              // material-color="green"
            />

            {/* Back fence. */}
            <Box
              args={[40, 40, 0.2]}
              position={[0, 20, 40]}
              receiveShadow
              material={
                new THREE.MeshStandardMaterial({
                  flatShading: true,
                  map: fence,
                  transparent: true,
                })
              }
              // material-side={DoubleSide}
              // material-color="green"
            />

            {/* Right fence. */}
            <Box
              args={[0.2, 40, 80]}
              position={[20, 20, 0]}
              receiveShadow
              material={
                new THREE.MeshStandardMaterial({
                  flatShading: true,
                  map: fence,
                  transparent: true,
                })
              }
              // material-side={DoubleSide}
              // material-color="green"
            />

            {/* Left fence. */}
            <Box
              args={[0.2, 40, 80]}
              position={[-20, 20, 0]}
              receiveShadow
              material={
                new THREE.MeshStandardMaterial({
                  flatShading: true,
                  map: fence,
                  transparent: true,
                })
              }

              // material-side={DoubleSide}
              // material-color="green"
            />
          </RigidBody>

          {/* <CuboidCollider position={[0, 0, 0]} args={[20, 0, 20]} visible /> */}
        </Physics>
      </Suspense>
    </>
  );
};

export default Game;
