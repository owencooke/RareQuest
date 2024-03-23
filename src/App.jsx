import { useRef } from "react";
import { PhaserGame } from "./game/PhaserGame";
import "./index.css";

function App() {
    const phaserRef = useRef();
    return (
        <div className="canvas-container">
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;

