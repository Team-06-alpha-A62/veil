import Chats from '../../components/Chats/Chats';
import Dashboard from '../../components/Dashboard/Dashboard';
import Friends from '../../components/Friends/Friends';
import Meetings from '../../components/Meetings/Meetings';
import Notes from '../../components/Notes/Notes';
import Notifications from '../../components/Notifications/Notifications';
import SidebarNavigation from '../../components/SidebarNavigation/Sidebar';
import Teams from '../../components/Teams/Teams';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../hoc/ProtectedRoute';
import Sidebar from '../../components/Sidebar/Sidebar';
const AppContent = () => {
  return (
    <ProtectedRoute>
      <div className="flex gap-10  h-screen">
        <SidebarNavigation />
        <main className="basis-4/5 p-8 my-8 rounded-3xl h-auto bg-opacity-50">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="teams" element={<Teams />} />
            <Route path="chats" element={<Chats />} />
            <Route path="notes" element={<Notes />} />
            <Route path="meetings" element={<Meetings />} />
          </Routes>
        </main>
        <Sidebar />
      </div>
    </ProtectedRoute>
  );
};

export default AppContent;
