import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useControls } from "leva";

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
  const ctrl = useControls({
    rotationSpeed: { value: 0.02, min: 0, max: 0.5, step: 0.01 },
  });

  useFrame(() => {
    ref.current.rotation.x += ctrl.rotationSpeed;
    ref.current.rotation.y += ctrl.rotationSpeed;
    ref.current.rotation.z += ctrl.rotationSpeed;
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
  const ctrl = useControls({
    bouncingSpeed: { value: 0.03, min: 0, max: 0.5, step: 0.01 },
  });
  let step = 0;
  useFrame(() => {
    step += ctrl.bouncingSpeed;
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
        <Cube />
        <Sphere />
      </Canvas>
    </>
  );
};

export default App;
