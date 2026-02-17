import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateBug from './pages/CreateBug';
import BugDetails from './pages/BugDetails';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-bug" element={<CreateBug />} />
      <Route path="/bug/:id" element={<BugDetails />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>

  );
}

export default App;
