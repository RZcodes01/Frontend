import Navbar from "./components/Navbar";
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
import QuickSkillPreview from "./components/QuickSkillPreview";

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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* <Route path="/" element={<QuickSkillPreview />} /> */}

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          <Route path="/" element={<Homepage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/:communityId" element={<SingleCommunity />} />
          <Route path="/project" element={<Project />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/projectdetail" element={<ProjectDetail />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
<<<<<<< HEAD

=======
          <Route path="/quickskills" element={<QuickSkills />} />
          <Route path="/quickskills" element={<QuickSkills />} />
>>>>>>> ed4e23f0c057f3af0c15d500a2ecd847afa6ff2e
        </Route>
      </Route>
          <Route path="/quickskills" element={<QuickSkills />} />

    </Routes>
  );
}
