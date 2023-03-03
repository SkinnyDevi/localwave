import ReactDOM from "react-dom/client";
import App from "./App";
import registerSW from "./serviceWorkerRegister";
import "./global.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);

registerSW();
