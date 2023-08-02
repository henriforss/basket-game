//@ts-nocheck
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { FPSControls } from "react-three-fpscontrols";
import Game from "./Game";

const App = () => {
  const [pointerDownTime, setPointerDownTime] = useState(null);
  const [shootVelocity, setShootVelocity] = useState(null);
  const [animatePower, setAnimatePower] = useState(false);
  const [cameraDirection, setCameraDirection] = useState([0, 7, 29]);
  const [goals, setGoals] = useState(0);
  const [timer, setTimer] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const gameOverRef = useRef();
  const infoRef = useRef();

  /* Handle shoot velocity. */
  const handlePointer = (e, string) => {
    setShootVelocity(null);

    if (string === "down") {
      gameOverRef.current.style.visibility = "hidden";

      if (!gameStarted) {
        infoRef.current.style.visibility = "hidden";
        setGameStarted(true);
        setGoals(0);
      }
      setPointerDownTime(e.timeStamp);
      setAnimatePower(true);
    }

    if (string === "up") {
      if (gameStarted) {
        const elapsedTime = e.timeStamp - pointerDownTime;
        /* Only shoot if press and hold is less than 2000 ms. */
        if (elapsedTime < 2000) {
          setShootVelocity(elapsedTime / 60);
        }
        setPointerDownTime(null);
        setAnimatePower(false);
      }
    }
  };

  /* Slightly adjust camera direction on init. */
  useEffect(() => {
    const randomX = Math.floor((Math.random() * 2 - 1) * 100) / 1000;
    const randomY = Math.floor((Math.random() * 2 - 1) * 100) / 1000 + 7;
    setCameraDirection([randomX, randomY, 29]);
  }, []);

  /* Start timer when game starts. */
  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setTimer((prevCount) => prevCount - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [gameStarted]);

  /* Stop game when timer runs out. */
  useEffect(() => {
    if (timer === 0) {
      setTimeout(() => {
        setGameStarted(false);
        setTimer(30);
        setAnimatePower(false);
        gameOverRef.current.style.visibility = "visible";
      }, 1000);
    }
  }, [timer]);

  return (
    <>
      <Canvas shadows>
        <FPSControls
          camProps={{
            makeDefault: true,
            fov: 75,
            position: [0, 7, 30],
          }}
          orbitProps={{
            target: cameraDirection,
          }}
          enableJoystick={false}
          enableKeyboard={false}
        />

        {/* <Environment background={true} preset="city" /> */}

        <Sky
          distance={1000}
          sunPosition={[0, 1, 0]}
          // inclination={1}
          // azimuth={1.5}
          turbidity={10}
          rayleigh={0.5}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />

        <directionalLight
          position={[0, 30, 10]}
          castShadow
          // color={"gray"}
          // intensity={0.7}
        >
          <orthographicCamera
            attach={"shadow-camera"}
            args={[-50, 50, 80, -100]}
          />
        </directionalLight>
        <Game shootVelocity={shootVelocity} setGoals={setGoals} />

        {/* <axesHelper args={[10]} /> */}
        {/* <gridHelper args={[40, 40]} /> */}

        {/* <PointerLockControls /> */}
        {/* <OrbitControls /> */}
      </Canvas>
      <button
        id="shoot"
        onPointerDown={(e) => handlePointer(e, "down")}
        onPointerUp={(e) => handlePointer(e, "up")}
        onContextMenu={(e) => e.preventDefault()}
      >
        Press and hold to shoot
      </button>
      <span id="power" className={animatePower ? "animate-power" : ""}></span>
      <span id="goals">{goals}</span>
      <span id="timer">{timer}</span>
      <span id="game-over" ref={gameOverRef}>
        GAME OVER!
        <br /> You got {goals} points.
      </span>
      <span id="info" ref={infoRef}>
        Start shooting!
      </span>
      <span id="name">Ghettobasket Challenge</span>
    </>
  );
};

export default App;
