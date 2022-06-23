import { Button, Chip } from "@mui/material";
import "./App.css";
import MainComponent from "./Components/Main";
function App() {
  return (
    <div className="App">
      
      {/* Main another component because this is where you are supposed to call react routes */}
      <MainComponent/>
    </div>
  );
}

export default App;
