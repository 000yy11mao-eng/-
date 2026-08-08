import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useAppContext } from './contexts/AppContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';
import AdminSchedule from './pages/AdminSchedule';
import AdminSubstitute from './pages/AdminSubstitute';
import Messages from './pages/Messages';
import TeacherSchedule from './pages/TeacherSchedule';

export default function App() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-emerald-600"><Loader2 className="animate-spin w-12 h-12" /></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        {user ? (
          <Route element={<Layout />}>
            {user.role === 'admin' ? (
              <>
                <Route path="/" element={<Navigate to="/admin" />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/schedule" element={<AdminSchedule />} />
                <Route path="/admin/substitute" element={<AdminSubstitute />} />
                <Route path="/admin/messages" element={<Messages />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/teacher" />} />
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/teacher/schedule" element={<TeacherSchedule />} />
                <Route path="/teacher/messages" element={<Messages />} />
              </>
            )}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

