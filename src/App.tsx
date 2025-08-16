/**
 * Main App component - Vite + React application with mesh gradient
 * @updatedAt 2025-08-16
 */

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { MeshGradientCanvas } from "./components/MeshGradientCanvas";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <MeshGradientCanvas
        colors={[
          "rgb(255, 100, 100)", // Red
          "rgb(100, 255, 100)", // Green
          "rgb(100, 100, 255)", // Blue
          "rgb(255, 255, 100)", // Yellow
          "rgb(255, 100, 255)", // Magenta
        ]}
      />
    </>
  );
}

export default App;
