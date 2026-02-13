import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LearningOptions from "./components/LearningOptions";
import Skills from "./pages/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";
import { Route, Routes } from "react-router-dom";
import Community from "./pages/Community";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/community" element={<Community/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
  );
}
