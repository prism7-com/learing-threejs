import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";

function Plane(props) {
  const ref = useRef();
  return (
    <mesh
      ref={ref}
      receiveShadow
      rotation={[-0.5 * Math.PI, 0, 0]}
      position={[15, 0, 0]}
      {...props}
    >
      <planeGeometry args={[60, 20]} />
      <meshLambertMaterial color={0xcccccc} />
    </mesh>
  );
}

function Cube(props) {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.x += props.speed;
    ref.current.rotation.y += props.speed;
    ref.current.rotation.z += props.speed;
  });
  return (
    <mesh ref={ref} castShadow position={[-4, 3, 0]} {...props}>
      <boxGeometry args={[4, 4, 4]} />
      <meshLambertMaterial color={0xff0000} />
    </mesh>
  );
}

function Sphere(props) {
  const ref = useRef();
  let step = 0;
  useFrame(() => {
    step += props.speed;
    ref.current.position.x = 20 + 10 * Math.cos(step);
    ref.current.position.y = 2 + 10 * Math.abs(Math.sin(step));
  });

  return (
    <mesh ref={ref} castShadow position={[20, 4, 2]} {...props}>
      <sphereGeometry args={[4, 20, 20]} />
      <meshLambertMaterial color={0x7777ff} />
    </mesh>
  );
}

const App = () => {
  const [opts] = useState({
    rotationSpeed: 0.02,
    bouncingSpeed: 0.03,
  });

  return (
    <>
      <Stats />
      <Canvas
        shadows
        pixelRatio={window.devicePixelRatio}
        camera={{
          fov: 45,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 1000,
          position: [-30, 40, 30],
        }}
      >
        <color attach="background" args={0xeeeeee} />
        <spotLight color={0xffffff} position={[-20, 30, -5]} castShadow />
        <axesHelper args={20} />
        <Plane />
        <Cube speed={opts.rotationSpeed} />
        <Sphere speed={opts.bouncingSpeed} />
      </Canvas>
    </>
  );
};

export default App;
