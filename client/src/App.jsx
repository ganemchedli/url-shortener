import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Redirect from "./pages/Redirect";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:urlId" element={<Redirect />} />
      </Routes>
    </Router>
  );
}

export default App;
