import { useRef } from "react";
import { PhaserGame } from "./game/PhaserGame";

function App() {
    const phaserRef = useRef();
    return <PhaserGame ref={phaserRef} />;
}

export default App;

