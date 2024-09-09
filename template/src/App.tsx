import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppContent from './views/AppContent/AppContent';
import Home from './views/Home/Home';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import { AuthProvider } from './providers/AuthProvider';
import { NoteModalProvider } from './providers/NoteModalProvider.tsx';
import SingleNoteDetailsModal from './components/SingleNoteDetailsModal/SingleNoteDetailsModal.tsx';
import { NotificationProvider } from './providers/NotificationProvider.tsx';
import { ThemeProvider } from './providers/ThemeProvider';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              index
              path="/app/*"
              element={
                <NotificationProvider>
                  <NoteModalProvider>
                    <AppContent />
                    <SingleNoteDetailsModal />
                  </NoteModalProvider>
                </NotificationProvider>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
