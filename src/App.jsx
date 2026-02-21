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
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950">
      <Navbar />
      {/* Remove pt-16 sm:pt-20 so the page starts at the very top */}
      <main className="flex-grow">
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/mentor" element={<MentorRegister />} />

      <Route path="/" element={<Homepage />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community/:communityId" element={<SingleCommunity />} />
      <Route path="/career" element={<Career />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/project" element={<Project />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/projectdetail" element={<ProjectDetail />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/quickskills" element={<QuickSkills />} />
          <Route path="/community/:id/module/:moduleId" element={<ModulePage />} />
        </Route>

        <Route element={<AdminDash />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<StudentDashLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/projects/:projectId" element={<ProjectDetail/>}/>
        </Route>

      </Route>
    </Routes>
  );
}