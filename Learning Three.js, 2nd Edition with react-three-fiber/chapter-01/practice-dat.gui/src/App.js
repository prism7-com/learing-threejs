import { useEffect, useState } from "react";
import dat from "dat.gui";
// import "dat.gui/build/dat.gui.css";

function Gui() {
  const [name, setName] = useState("sum");
  const [age, setAge] = useState(25);

  useEffect(() => {
    const gui = new dat.GUI();
    gui.add({ name }, "name").onChange((value) => setName(value));
    gui.add({ age }, "age", 0, 100).onChange((value) => setAge(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    name,
    age,
  };
}

function App() {
  const controls = Gui();
  return (
    <div className="App">
      <div>
        {controls.name}
        {controls.age}
      </div>
    </div>
  );
}

export default App;
