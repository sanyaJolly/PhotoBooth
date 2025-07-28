import "./App.css";
import Camera from "./components/Camera";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="homePage">
      {" "}
      <NavBar /> <Camera />{" "}
    </div>
  );
}

export default App;
