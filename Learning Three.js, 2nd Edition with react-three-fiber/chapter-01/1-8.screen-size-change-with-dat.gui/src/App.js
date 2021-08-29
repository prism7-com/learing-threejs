import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import dat from "dat.gui";

function Gui() {
  const [rotationSpeed, setRotationSpeed] = useState(0.02);
  const [bouncingSpeed, setBouncingSpeed] = useState(0.03);

  useEffect(() => {
    const gui = new dat.GUI();
    gui.add({ rotationSpeed }, "rotationSpeed", 0, 0.5, 0.01).onChange((value) => setRotationSpeed(value));
    gui.add({ bouncingSpeed }, "bouncingSpeed", 0, 0.5, 0.01).onChange((value) => setBouncingSpeed(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    rotationSpeed,
    bouncingSpeed,
  };
}

function Plane(props) {
  const ref = useRef();
  return (
    <mesh ref={ref} receiveShadow rotation={[-0.5 * Math.PI, 0, 0]} position={[15, 0, 0]} {...props}>
      <planeGeometry args={[60, 20]} />
      <meshLambertMaterial color={0xcccccc} />
    </mesh>
  );
}

function Cube(props, { rotationSpeed }) {
  const ref = useRef();

  useFrame(() => {
    ref.current.rotation.x += rotationSpeed;
    ref.current.rotation.y += rotationSpeed;
    ref.current.rotation.z += rotationSpeed;
  });
  return (
    <mesh ref={ref} castShadow position={[-4, 3, 0]} {...props}>
      <boxGeometry args={[4, 4, 4]} />
      <meshLambertMaterial color={0xff0000} />
    </mesh>
  );
}

function Sphere(props, { bouncingSpeed }) {
  const ref = useRef();
  let step = 0;
  useFrame(() => {
    step += bouncingSpeed;
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
  const controls = Gui();
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
        <Cube rotationSpeed={controls.rotationSpeed} />
        <Sphere bouncingSpeed={controls.bouncingSpeed} />
      </Canvas>
    </>
  );
};

export default App;
