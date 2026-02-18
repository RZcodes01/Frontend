import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes, Outlet } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Community from "./pages/Community";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Project from "./pages/Project";
import Leaderboard from "./pages/Leaderboard";
import ProjectDetail from "./pages/ProjectDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/StudentDashboard";
import SingleCommunity from "./pages/SingleCommunity";
import QuickSkills from "./pages/QuickSkills";


// ✅ Layout for all protected pages
function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      
      {/* 🔓 Public Routes (No Navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 Protected Routes (With Navbar + Footer) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          <Route path="/" element={<Homepage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/:communityId" element={<SingleCommunity />} />
          <Route path="/project" element={<Project />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/projectdetail" element={<ProjectDetail />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/quickskills" element={<QuickSkills />} />

        </Route>
      </Route>

    </Routes>
  );
}
