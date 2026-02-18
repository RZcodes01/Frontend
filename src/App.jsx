import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LearningOptions from "./components/LearningOptions";
import Skills from "./pages/Skills";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";
import { Route, Routes } from "react-router-dom";
import Community from "./pages/Community";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Project from "./pages/Project";
import Leaderboard from "./pages/Leaderboard";
import ProjectDetail from "./pages/ProjectDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/StudentDashboard";
import SingleCommunity from "./pages/SingleCommunity";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:communityId" element={<SingleCommunity />} />
        <Route path="/project" element={<Project />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/projectdetail" element={<ProjectDetail />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
      </Route>
    </Routes>
  );
}
