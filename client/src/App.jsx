import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppLayout from './components/layout/AppLayout.jsx';
import AdminShell from './components/layout/AdminShell.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ProfileDashboard from './pages/ProfileDashboard.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import Settings from './pages/Settings.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageBlogs from './pages/admin/ManageBlogs.jsx';
import BlogEditor from './pages/admin/BlogEditor.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import ManageComments from './pages/admin/ManageComments.jsx';
import Analytics from './pages/admin/Analytics.jsx';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProfileDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/admin/login" element={<Login admin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="blogs" element={<ManageBlogs />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/:id/edit" element={<BlogEditor />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="comments" element={<ManageComments />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
