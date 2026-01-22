import "./App.css";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NavigationBar from "./components/Navigationbar";

function App() {
  //

  return (
    <>
      <main>
        <NavigationBar />

        {/* <Outlet /> */}
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
