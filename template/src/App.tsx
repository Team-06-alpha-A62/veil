import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppContent from './views/AppContent/AppContent';
import Home from './views/Home/Home';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import { AuthProvider } from './providers/AuthProvider';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index path="/app/*" element={<AppContent />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
