import { useState } from "react";
import TogglePurple from "./components/TogglePurple";
import SelectColor from "./components/SelectColor";
import CircleProperty from "./components/CircleProperty";
function App() {
  const [isPurple, setIsPurple] = useState<boolean>(false);
  const [textColor, setTextColor] = useState<string>("");

  const [size, setSize] = useState<number>(150);
  const [rotate, setRotate] = useState<number>(0);

  const circleStyle = {
    height: `${size}px`,
    width: `${size}px`,
    lineHeight: `${size}px`,

    transform: `rotate(${rotate}deg)`,
  };

  return (
    <main>
      <TogglePurple isPurple={isPurple} setIsPurple={setIsPurple} />

      <SelectColor textColor={textColor} setTextColor={setTextColor} />

      <CircleProperty property={size} setProperty={setSize}>
        Circle Size
      </CircleProperty>

      <CircleProperty property={rotate} setProperty={setRotate}>
        Circle Rotate
      </CircleProperty>
      <div
        className={`circle ${isPurple ? "purple" : ""} ${textColor}`}
        style={circleStyle}
      >
        Hi!
      </div>
    </main>
  );
}

export default App;
