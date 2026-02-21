import Navbar from "./components/Navbar";
import { Route, Routes, Outlet } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Community from "./pages/Community";
import Register from "./pages/StudentRegister";
import MentorRegister from "./pages/MentorRegister";
import Login from "./pages/Login";
import Project from "./pages/Project";
import Leaderboard from "./pages/Leaderboard";
import ProjectDetail from "./pages/ProjectDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/StudentDashboard";
import SingleCommunity from "./pages/SingleCommunity";
import QuickSkills from "./pages/QuickSkills";
import QuickSkillPreview from "./components/QuickSkillPreview";
import Career from "./pages/Career";
import ModulePage from "./pages/ModulePage";
import AdminDashboard from "./pages/AdminDashboard";
import UploadReel from "./pages/UploadReel";

function MainLayout() {
  return (
    <div className="flex flex-col h-screen bg-neutral-950 overflow-hidden">
      <Navbar />
      {/* Using h-screen and overflow-hidden on the parent 
          plus pt-[72px] ensures the content starts after the navbar 
          and stays within the visible bounds.
      */}
      <main className="flex-1 pt-[72px] relative overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

function AdminDash() {
  return (
    <div className="h-screen flex flex-col bg-neutral-950">
      <Navbar />
      <main className="flex-1 pt-[72px] overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

function StudentDashLayout() {
  return (
    <div className="h-screen flex flex-col bg-neutral-950">
      <Navbar />
      <main className="flex-1 pt-[72px] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/mentor" element={<MentorRegister />} />
      <Route path="/" element={<Homepage />} />
      <Route element={<MainLayout />}>
        <Route path="/community" element={<Community />} />
        <Route path="/community/:communityId" element={<SingleCommunity />} />
      </Route>

      <Route path="/career" element={<Career />} />

      {/* --- SHARED PROTECTED ROUTES (Student, Mentor, and Admin) --- */}
      <Route element={<ProtectedRoute allowedRoles={["student", "mentor", "admin"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/project" element={<Project />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/projectdetail" element={<ProjectDetail />} />
          <Route path="/quickskills" element={<QuickSkills />} />
          <Route path="/upload-skill" element={<UploadReel />} />
          <Route path="/community/:id/module/:moduleId" element={<ModulePage />} />
        </Route>
      </Route>

      {/* --- ADMIN ONLY ROUTES --- */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminDash />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* --- STUDENT ONLY ROUTES --- */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route element={<StudentDashLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
        </Route>
      </Route>

    </Routes>
  );
}